import { Router } from 'express';
import { COLLECTIONS, COLLECTION_NAMES } from '../models/index.js';
import { createCrudRouter, toClientShape } from './crudFactory.js';
import { seedDatabase } from '../seed/run.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import authRouter from './auth.js';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Returns API health status and the known collection names.
 *     responses:
 *       200:
 *         description: Health check successful.
 */
router.get('/health', (req, res) => res.json({ ok: true, collections: COLLECTION_NAMES }));

// Signup/login are necessarily public; everything else below this line
// requires a valid session (see requireAuth in middleware/auth.js).
router.use('/auth', authRouter);
router.use(requireAuth);

/**
 * @openapi
 * /api/bootstrap:
 *   get:
 *     summary: Bootstrap all collections
 *     description: Returns a full application bootstrap payload keyed by collection name for the frontend.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bootstrap payload returned.
 *       401:
 *         description: Missing or invalid JWT.
 */
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

/**
 * @openapi
 * /api/reset:
 *   post:
 *     summary: Reset sample data
 *     description: Destructively reseeds all collections from the frontend's seed data. Restricted to Master Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reset completed successfully.
 *       401:
 *         description: Missing or invalid JWT.
 *       403:
 *         description: User is not allowed to reset sample data.
 */
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
