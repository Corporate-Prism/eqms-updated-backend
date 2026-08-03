import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createSeedData } from './data/seedData.js';
import { COLLECTIONS } from '../models/index.js';
import { connectDB } from '../config/db.js';

// Wipes and repopulates every collection from the same seed data the
// frontend ships with. Used by `npm run seed` (fresh DB) and by the
// POST /api/reset route (frontend's "Reset sample data" sidebar action).
export async function seedDatabase() {
  const data = createSeedData();
  const counts = {};
  for (const [name, Model] of Object.entries(COLLECTIONS)) {
    let records = (data[name] || []).map(({ id, ...rest }) => ({ _id: id, ...rest }));
    // insertMany() bypasses the User schema's pre('save') hashing hook, so
    // seed passwords (plaintext in the seed data, e.g. 'Welcome@123') are
    // hashed explicitly here instead.
    if (name === 'users') {
      records = await Promise.all(records.map(async (r) => ({ ...r, password: await bcrypt.hash(r.password, 10) })));
    }
    await Model.deleteMany({});
    if (records.length) await Model.insertMany(records, { ordered: true });
    counts[name] = records.length;
  }
  return counts;
}

// Only auto-run when this file is executed directly (`npm run seed`), not
// when imported by routes/index.js for the /api/reset endpoint.
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  connectDB()
    .then(seedDatabase)
    .then((counts) => {
      console.log('Seeded:', counts);
      return import('mongoose').then((m) => m.default.disconnect());
    })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err.message);
      process.exit(1);
    });
}
