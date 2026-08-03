import { Router } from 'express';
import { COLLECTIONS, COLLECTION_NAMES } from '../models/index.js';
import { createCrudRouter, toClientShape } from './crudFactory.js';
import { seedDatabase } from '../seed/run.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import authRouter from './auth.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true, collections: COLLECTION_NAMES }));

// Signup/login are necessarily public; everything else below this line
// requires a valid session (see requireAuth in middleware/auth.js).
router.use('/auth', authRouter);
router.use(requireAuth);

// Single round trip for the frontend's initial load — returns every
// collection keyed exactly like the frontend's `data` object. Users'
// password hashes are stripped, same as the individual /api/users routes.
router.get('/bootstrap', async (req, res, next) => {
  try {
    const result = {};
    await Promise.all(
      COLLECTION_NAMES.map(async (name) => {
        const docs = await COLLECTIONS[name].find({}).lean();
        const hide = name === 'users' ? ['password'] : [];
        result[name] = docs.map((d) => toClientShape(d, hide));
      })
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Re-seeds every collection from the same seed data the frontend ships with
// — backs the sidebar's "Reset sample data" action. Destructive, so it's
// restricted to Master Admin rather than open to any logged-in user.
router.post('/reset', requireRole('Master Admin'), async (req, res, next) => {
  try {
    const counts = await seedDatabase();
    res.json({ ok: true, counts });
  } catch (err) {
    next(err);
  }
});

COLLECTION_NAMES.forEach((name) => {
  const hideFields = name === 'users' ? ['password'] : [];
  router.use(`/${name}`, createCrudRouter(COLLECTIONS[name], name, { hideFields }));
});

export default router;
