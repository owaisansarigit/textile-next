import mongoose from "mongoose";
const URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!URI) throw new Error("MONGO_URI missing");
let cache = global._mongoose || (global._mongoose = { conn: null, promise: null });
export async function connectDB() {
    if (cache.conn) {
        console.log("[Mongo] ♻️ reuse connection");
        return cache.conn;
    }
    // hardWipeDatabase()
    console.log("[Mongo] 🔌 first connection");
    cache.promise ||= mongoose.connect(URI, {
        dbName: "textile",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 3000,
    });
    cache.conn = await cache.promise;
    return cache.conn;
}

// const hardWipeDatabase = async () => {
//     if (process.env.NODE_ENV === "production") {
//         throw new Error("❌ Database wipe blocked in production");
//     }

//     await mongoose.connection.dropDatabase();
//     console.log("[Mongo] 💣 Database dropped completely");
// };