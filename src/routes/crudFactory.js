import { Router } from 'express';

// Mongoose stores the frontend's `id` as `_id`; this strips Mongo-only
// fields (plus any collection-specific sensitive fields, e.g. users'
// `password`) and renames `_id` back to `id` so API responses match what
// the React app already expects.
function toClientShape(doc, hideFields = []) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  hideFields.forEach((f) => delete rest[f]);
  return { id: _id, ...rest };
}

function fromClientShape(body) {
  const { id, _id, __v, ...rest } = body || {};
  return rest;
}

// One router per collection: GET /, GET /:id, POST /, PATCH /:id, DELETE /:id,
// plus PUT /replace-all for the frontend's bulk-collection-sync path (see
// AppDataContext's setData). Every route in this file is intentionally
// generic — it's mounted once per collection in routes/index.js rather than
// hand-written 23 times. `hideFields` strips sensitive fields (users'
// hashed `password`) from every response this router sends.
export function createCrudRouter(Model, collectionName, { hideFields = [] } = {}) {
  const router = Router();
  const shape = (doc) => toClientShape(doc, hideFields);

  /**
   * @openapi
   * /api/{collection}:
   *   get:
   *     summary: List records for a collection
   *     description: Returns every record from the requested collection, with Mongo-only fields stripped and `id` mapped back to the client shape.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: collection
   *         required: true
   *         schema:
   *           type: string
   *         description: Collection name such as users, plants, or qrmRecords.
   *     responses:
   *       200:
   *         description: List of records returned successfully.
   *       401:
   *         description: Missing or invalid JWT.
   */
  router.get('/', async (req, res, next) => {
    try {
      const docs = await Model.find({}).lean();
      res.json(docs.map(shape));
    } catch (err) {
      next(err);
    }
  });

  /**
   * @openapi
   * /api/{collection}/{id}:
   *   get:
   *     summary: Fetch one record by id
   *     description: Returns a single record from the requested collection.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: collection
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Record returned successfully.
   *       401:
   *         description: Missing or invalid JWT.
   *       404:
   *         description: Record not found.
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id).lean();
      if (!doc) return res.status(404).json({ error: `${collectionName} record not found` });
      res.json(shape(doc));
    } catch (err) {
      next(err);
    }
  });

  /**
   * @openapi
   * /api/{collection}:
   *   post:
   *     summary: Create a record
   *     description: Creates a new record in the requested collection.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: collection
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       201:
   *         description: Record created successfully.
   *       401:
   *         description: Missing or invalid JWT.
   */
  router.post('/', async (req, res, next) => {
    try {
      const payload = fromClientShape(req.body);
      const id = req.body.id || req.body._id;
      const created = await Model.create(id ? { _id: id, ...payload } : payload);
      res.status(201).json(shape(created.toObject()));
    } catch (err) {
      next(err);
    }
  });

  /**
   * @openapi
   * /api/{collection}/{id}:
   *   patch:
   *     summary: Update a record
   *     description: Partially updates one record in the requested collection.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: collection
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Record updated successfully.
   *       401:
   *         description: Missing or invalid JWT.
   *       404:
   *         description: Record not found.
   */
  router.patch('/:id', async (req, res, next) => {
    try {
      const payload = fromClientShape(req.body);
      const updated = await Model.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).lean();
      if (!updated) return res.status(404).json({ error: `${collectionName} record not found` });
      res.json(shape(updated));
    } catch (err) {
      next(err);
    }
  });

  /**
   * @openapi
   * /api/{collection}/{id}:
   *   delete:
   *     summary: Delete a record
   *     description: Deletes one record from the requested collection.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: collection
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Record deleted successfully.
   *       401:
   *         description: Missing or invalid JWT.
   */
  router.delete('/:id', async (req, res, next) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  // Bulk replace — the whole collection's contents are swapped for the given
  // array in one call. This backs the frontend's generic `setData(updater)`
  // escape hatch, which the business-module screens (Deviations, eMBR, etc.)
  // use for multi-field record updates; it lets that existing frontend code
  // work unchanged rather than rewriting ~25 detail screens to call
  // fine-grained endpoints. addRecord/updateRecord/removeRecord (used by the
  // Hierarchy admin screens) use the routes above instead.
  /**
   * @openapi
   * /api/{collection}/replace-all:
   *   put:
   *     summary: Replace entire collection contents
   *     description: Bulk-replaces all records in the requested collection with the provided array payload.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: collection
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [records]
   *             properties:
   *               records:
   *                 type: array
   *                 items:
   *                   type: object
   *     responses:
   *       200:
   *         description: Collection replaced successfully.
   *       401:
   *         description: Missing or invalid JWT.
   */
  router.put('/replace-all', async (req, res, next) => {
    try {
      const records = Array.isArray(req.body.records) ? req.body.records : [];
      const docs = records.map((r) => ({ _id: r.id, ...fromClientShape(r) }));
      await Model.deleteMany({});
      if (docs.length) await Model.insertMany(docs, { ordered: true });
      res.json({ ok: true, count: docs.length });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export { toClientShape };
