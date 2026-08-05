import { Router } from 'express';
import { User } from '../models/orgModels.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { ROLES_LIST } from '../lib/roles.js';

function sanitize(userDoc) {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { _id, password, __v, ...rest } = obj;
  return { id: _id, ...rest };
}

function genUserId() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Factory rather than a bare router so the User model can be swapped out in
// tests (see __scratch_test__) without touching real MongoDB — the same
// dependency-injection shape createCrudRouter(Model, ...) already uses.
export function createAuthRouter(UserModel) {
  const router = Router();

  /**
   * @openapi
   * /api/auth/signup:
   *   post:
   *     summary: Sign up a new user
   *     description: Creates a new active user and returns a JWT plus sanitized user profile.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [firstName, lastName, employeeId, password, role]
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               employeeId:
   *                 type: string
   *               mobile:
   *                 type: string
   *               password:
   *                 type: string
   *               role:
   *                 type: string
   *               designation:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created successfully.
   *       400:
   *         description: Invalid signup payload.
   *       409:
   *         description: Employee ID already exists.
   */
  router.post('/signup', async (req, res, next) => {
    try {
      const { firstName, lastName, employeeId, mobile, password, role, designation } = req.body || {};

      if (!firstName?.trim() || !lastName?.trim() || !employeeId?.trim() || !password) {
        return res.status(400).json({ error: 'First name, last name, employee ID and password are required.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }
      if (!ROLES_LIST.includes(role)) {
        return res.status(400).json({ error: `Role must be one of: ${ROLES_LIST.join(', ')}.` });
      }

      const existing = await UserModel.findOne({ employeeId: employeeId.trim() }).lean();
      if (existing) {
        return res.status(409).json({ error: `Employee ID "${employeeId}" is already registered.` });
      }

      const user = await UserModel.create({
        _id: genUserId(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        employeeId: employeeId.trim(),
        mobile: mobile?.trim() || '',
        role,
        designation: designation?.trim() || '',
        password,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10),
      });

      const token = signToken(user);
      res.status(201).json({ token, user: sanitize(user) });
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ error: 'Employee ID is already registered.' });
      next(err);
    }
  });

  /**
   * @openapi
   * /api/auth/login:
   *   post:
   *     summary: Log in
   *     description: Authenticates a user by employee ID and password and returns a signed JWT.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [employeeId, password]
   *             properties:
   *               employeeId:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful.
   *       400:
   *         description: Missing credentials.
   *       401:
   *         description: Invalid employee ID or password.
   */
  router.post('/login', async (req, res, next) => {
    try {
      const { employeeId, password } = req.body || {};
      if (!employeeId?.trim() || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required.' });
      }

      const user = await UserModel.findOne({ employeeId: employeeId.trim() });
      if (!user) return res.status(401).json({ error: 'Invalid employee ID or password.' });

      if (user.status !== 'active') {
        return res.status(403).json({ error: 'This account has been deactivated. Contact your Master Admin.' });
      }

      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ error: 'Invalid employee ID or password.' });

      const token = signToken(user);
      res.json({ token, user: sanitize(user) });
    } catch (err) {
      next(err);
    }
  });

  // Stateless JWT — nothing to invalidate server-side. Kept as a real
  // endpoint (rather than purely client-side) for API symmetry and as a
  // place to add a token blacklist later if that's ever needed.
  router.post('/logout', (req, res) => {
    res.json({ ok: true });
  });

  /**
   * @openapi
   * /api/auth/me:
   *   get:
   *     summary: Current user profile
   *     description: Returns the currently authenticated user profile from the JWT.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile returned.
   *       401:
   *         description: Missing or invalid JWT.
   */
  router.get('/me', requireAuth, async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
      res.json({ user: sanitize(user) });
    } catch (err) {
      next(err);
    }
  });

  // Backs the e-signature modal's re-authentication step — verifies a
  // password against the CURRENTLY authenticated user (from the JWT), so a
  // password hash never needs to reach the browser.
  router.post('/verify-password', requireAuth, async (req, res, next) => {
    try {
      const { password } = req.body || {};
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
      const valid = password ? await user.comparePassword(password) : false;
      res.json({ valid });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export default createAuthRouter(User);
