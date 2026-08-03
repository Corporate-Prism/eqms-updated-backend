import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';

if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET is not set — using an insecure dev default. Set it in .env before deploying.');
}

export function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

// Verifies the Bearer token and attaches { id, role } to req.user. Every
// data route (everything under /api except /api/auth/* and /api/health)
// goes through this — see routes/index.js.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated — log in and try again.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Your session has expired — please log in again.' });
  }
}

// Targeted authorization for the few actions that shouldn't be available to
// every role (e.g. reseeding the whole database). Not a general workflow
// permission system — see the backend README for that scope boundary.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `This action requires one of: ${roles.join(', ')}.` });
    }
    next();
  };
}
