import mongoose, { Mongoose } from 'mongoose';

/**
 * MONGODB_URI should be defined in your environment variables.
 * In development, use .env.local to store your credentials.
 * Validation is performed at runtime in connectToDatabase() to avoid
 * crashing during build time.
 */

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Established a connection to MongoDB or returns the cached connection.
 */
async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Validate MONGODB_URI at runtime
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    const opts = {
      bufferCommands: false,
    };

    // Initialize the connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise if the connection fails
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;