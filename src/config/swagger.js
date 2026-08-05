import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eQMS Backend API',
      version: '1.0.0',
      description: 'RESTful API server for eQMS compliance, document control, and audit trails.',
      contact: {
        name: 'Quality & Compliance Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // Path to the API docs (parses JSDoc annotations in route files)
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);