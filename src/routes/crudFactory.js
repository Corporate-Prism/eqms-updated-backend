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

  router.get('/', async (req, res, next) => {
    try {
      const docs = await Model.find({}).lean();
      res.json(docs.map(shape));
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id).lean();
      if (!doc) return res.status(404).json({ error: `${collectionName} record not found` });
      res.json(shape(doc));
    } catch (err) {
      next(err);
    }
  });

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
