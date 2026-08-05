import swaggerJSDoc from 'swagger-jsdoc';
import { COLLECTIONS, COLLECTION_NAMES } from '../models/index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EQMS Backend API',
      version: '1.0.0',
      description: 'Swagger documentation for the EQMS Express backend.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/routes/**/*.js', './server.js'],
};

const spec = swaggerJSDoc(options);

if (!spec.paths) spec.paths = {};
if (!spec.tags) spec.tags = [];
if (!spec.components) spec.components = {};
if (!spec.components.schemas) spec.components.schemas = {};

// Remove the literal `{collection}` placeholder paths swagger-jsdoc picked
// up from the generic CRUD router's JSDoc comments — those are templates,
// not real routes. Real per-collection paths are injected below.
delete spec.paths['/api/{collection}'];
delete spec.paths['/api/{collection}/{id}'];
delete spec.paths['/api/{collection}/replace-all'];

// Fields that createCrudRouter's `hideFields` strips from responses per
// collection (see routes/index.js). Kept in sync manually here since the
// hideFields config isn't itself exported for introspection.
const HIDDEN_FIELDS = {
  users: ['password'],
};

// --- Mongoose SchemaType -> OpenAPI schema -------------------------------

function mongooseFieldToOpenApi(path) {
  const schema = {};

  switch (path.instance) {
    case 'String':
      schema.type = 'string';
      break;
    case 'Number':
      schema.type = 'number';
      break;
    case 'Boolean':
      schema.type = 'boolean';
      break;
    case 'Date':
      schema.type = 'string';
      schema.format = 'date-time';
      break;
    case 'Array':
      schema.type = 'array';
      schema.items = { type: 'object' };
      break;
    case 'Mixed':
    case 'Map':
      // Deliberately schema-less fields (nested workflow state, timelines,
      // team lists, etc.) — document as a free-form object rather than
      // guessing a shape that will drift out of date.
      schema.type = 'object';
      schema.additionalProperties = true;
      schema.description = 'Flexible nested structure — shape varies by record.';
      break;
    case 'ObjectID':
      schema.type = 'string';
      break;
    default:
      schema.type = 'string';
  }

  if (Array.isArray(path.enumValues) && path.enumValues.length) {
    schema.enum = path.enumValues;
  }

  if (path.defaultValue !== undefined && typeof path.defaultValue !== 'function') {
    schema.default = path.defaultValue;
  }

  return schema;
}

// Builds an OpenAPI object schema straight from a live Mongoose model,
// matching the client shape createCrudRouter actually returns: `_id` -> `id`,
// `__v` dropped, and any collection-specific hideFields (e.g. users'
// password) dropped too.
function buildSchemaFromModel(Model, hideFields = []) {
  const properties = {
    id: { type: 'string', description: "Record id (Mongo's `_id`, mapped to `id` for the client)." },
  };
  const required = [];

  Object.entries(Model.schema.paths).forEach(([field, path]) => {
    if (field === '_id' || field === '__v') return;
    if (hideFields.includes(field)) return;

    properties[field] = mongooseFieldToOpenApi(path);
    if (path.isRequired) required.push(field);
  });

  return {
    type: 'object',
    properties,
    ...(required.length ? { required } : {}),
  };
}

function addCollectionDocs(collectionKey) {
  const Model = COLLECTIONS[collectionKey];
  if (!Model) return;

  const hideFields = HIDDEN_FIELDS[collectionKey] || [];
  const schemaName = Model.modelName; // e.g. 'User', 'Deviation'
  const schemaRef = `#/components/schemas/${schemaName}`;

  spec.components.schemas[schemaName] = buildSchemaFromModel(Model, hideFields);

  const basePath = `/api/${collectionKey}`;

  spec.paths[basePath] = {
    get: {
      tags: [collectionKey],
      summary: `List ${collectionKey}`,
      description: `Returns every ${schemaName} record.`,
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Success',
          content: { 'application/json': { schema: { type: 'array', items: { $ref: schemaRef } } } },
        },
        401: { description: 'Missing or invalid JWT.' },
      },
    },
    post: {
      tags: [collectionKey],
      summary: `Create a new ${schemaName} record`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: schemaRef } } },
      },
      responses: {
        201: {
          description: 'Created',
          content: { 'application/json': { schema: { $ref: schemaRef } } },
        },
        401: { description: 'Missing or invalid JWT.' },
      },
    },
  };

  spec.paths[`${basePath}/{id}`] = {
    get: {
      tags: [collectionKey],
      summary: `Get a ${schemaName} record by id`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: {
          description: 'Success',
          content: { 'application/json': { schema: { $ref: schemaRef } } },
        },
        401: { description: 'Missing or invalid JWT.' },
        404: { description: 'Record not found.' },
      },
    },
    patch: {
      tags: [collectionKey],
      summary: `Update a ${schemaName} record`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: schemaRef } } },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: { $ref: schemaRef } } },
        },
        401: { description: 'Missing or invalid JWT.' },
        404: { description: 'Record not found.' },
      },
    },
    delete: {
      tags: [collectionKey],
      summary: `Delete a ${schemaName} record`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        204: { description: 'Deleted' },
        401: { description: 'Missing or invalid JWT.' },
      },
    },
  };

  spec.paths[`${basePath}/replace-all`] = {
    put: {
      tags: [collectionKey],
      summary: `Replace all ${collectionKey} records`,
      description: `Bulk-replaces the entire ${collectionKey} collection with the provided array.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['records'],
              properties: { records: { type: 'array', items: { $ref: schemaRef } } },
            },
          },
        },
      },
      responses: {
        200: { description: 'Replaced' },
        401: { description: 'Missing or invalid JWT.' },
      },
    },
  };

  if (!spec.tags.some((tag) => tag.name === collectionKey)) {
    spec.tags.push({ name: collectionKey, description: `${schemaName} collection endpoints` });
  }
}

COLLECTION_NAMES.forEach(addCollectionDocs);

export const swaggerSpec = spec;