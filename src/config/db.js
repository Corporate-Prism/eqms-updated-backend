import mongoose from 'mongoose';

let connected = false;

export async function connectDB(uri) {
  if (connected) return mongoose.connection;
  const connectionString = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eqms';
  mongoose.set('strictQuery', true);
  // Fail fast instead of silently queuing queries when there's no
  // connection yet — without this, a request made before Mongo is up (or
  // while it's down) hangs until bufferTimeoutMS instead of erroring.
  mongoose.set('bufferCommands', false);

  // Mongoose's connection is an EventEmitter; an 'error' event with no
  // listener is a classic Node crash (EventEmitter throws by default). This
  // keeps a transient/later connection error from taking the whole API down.
  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message);
  });

  await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 4000 });
  connected = true;
  console.log(`[db] connected to ${connectionString.replace(/\/\/.*@/, '//***@')}`);
  return mongoose.connection;
}

export async function disconnectDB() {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
}
