// import mongoose from "mongoose";
// const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
// if (!MONGO_URI) {
//   console.error("[Mongo] ❌ MONGO_URI missing");
//   throw new Error("Please define MONGO_URI in .env");
// }
// let cached = global._mongoose;
// if (!cached) {
//   console.log("[Mongo] 🆕 Creating global mongoose cache");
//   cached = global._mongoose = {
//     conn: null,
//     promise: null,
//   };
// } else {
//   console.log("[Mongo] ♻️ Using existing global mongoose cache");
// }
// export async function connectDB() {
//   if (cached.conn) {
//     console.log("[Mongo] ✅ Reusing existing MongoDB connection");
//     return cached.conn;
//   }
//   if (cached.promise) {
//     console.log("[Mongo] ⏳ Awaiting existing connection promise");
//   }
//   if (!cached.promise) {
//     console.log("[Mongo] 🔌 Creating new MongoDB connection...");
//     cached.promise = mongoose.connect(MONGO_URI, {
//       dbName: "textile",
//       maxPoolSize: 10,
//       bufferCommands: false,
//       serverSelectionTimeoutMS: 3000,
//     });
//   }
//   cached.conn = await cached.promise;
//   mongoose.connection.once("open", () => {
//     console.log("[Mongo] 🚀 MongoDB connected successfully");
//   });
//   return cached.conn;
// }
import mongoose from "mongoose";

const URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!URI) throw new Error("MONGO_URI missing");

let cache = global._mongoose || (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) {
    console.log("[Mongo] ♻️ reuse connection");
    return cache.conn;
  }

  console.log("[Mongo] 🔌 first connection");
  cache.promise ||= mongoose.connect(URI, {
    dbName: "textile",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 3000,
  });

  cache.conn = await cache.promise;

  // log collections + counts
  const cols = await mongoose.connection.db.listCollections().toArray();
  console.log(
    "[Mongo] 📊 collections:",
    cols.map(c => c.name)
  );

  for (const c of cols) {
    const count = await mongoose.connection.db
      .collection(c.name)
      .countDocuments();
    console.log(`   • ${c.name}: ${count}`);
  }

  return cache.conn;
}
