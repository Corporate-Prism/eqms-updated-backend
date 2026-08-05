import 'dotenv/config';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './src/config/db.js';
import apiRouter from './src/routes/index.js';
import { swaggerSpec } from './src/config/swagger.js';

const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || '*';

// Defensive net: log and keep running rather than let a missed .catch()
// anywhere take the whole API down.
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});

const app = express();
app.use(cors({ origin: ORIGIN }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ name: 'eqms-backend', status: 'ok' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
app.use('/api', apiRouter);

// Centralized error handler — every route above calls next(err) on failure
// rather than handling it inline, so this is the one place that shapes
// error responses (Mongoose validation errors, cast errors, duplicate
// unique-index writes, etc).
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { value: 1 })[0];
    return res.status(409).json({ error: `That ${field} is already in use.` });
  }
  const status = err.name === 'ValidationError' ? 400 : err.name === 'CastError' ? 400 : 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

async function start() {
  // Start accepting HTTP connections immediately rather than waiting on
  // Mongo — a slow/unreachable database shouldn't make the whole API hang
  // on boot. Requests that hit the DB will simply error until it connects.
  app.listen(PORT, () => {
    console.log(`[server] eqms-backend listening on http://localhost:${PORT}`);
    console.log(`[server] swagger: http://localhost:${PORT}/api-docs`);
    console.log(`[server] try: curl http://localhost:${PORT}/api/health`);
  });

  try {
    await connectDB();
  } catch (err) {
    console.error('[db] connection failed — the API is up but every DB-backed request will error until MongoDB is reachable.');
    console.error(`[db] ${err.message}`);
    console.error('[db] set MONGODB_URI in .env, or run a local mongod, then restart.');
  }
}

start();
