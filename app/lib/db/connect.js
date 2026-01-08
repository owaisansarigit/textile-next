import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const globalWithMongo = global;
globalWithMongo.mongoose = globalWithMongo.mongoose || {};

let cached = globalWithMongo.mongoose;

async function connectDB() {
    // Return existing connection if available and healthy
    if (cached.conn && mongoose.connection.readyState === 1) {
        console.log('✅ Using existing MongoDB connection');
        return cached.conn;
    }

    // If connection exists but is not ready, try to reconnect
    if (cached.conn && mongoose.connection.readyState !== 1) {
        console.log('🔄 MongoDB connection not ready, reconnecting...');
        try {
            await mongoose.disconnect();
        } catch (err) {
            console.log('Error disconnecting:', err.message);
        }
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        };

        console.log('🔌 Creating new MongoDB connection...');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB connected successfully');
            return mongoose;
        }).catch((err) => {
            console.error('❌ MongoDB connection error:', err);
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;

        // Setup connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        cached.promise = null;
        console.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }

    return cached.conn;
}


connectDB().catch(console.error);


setInterval(() => {
    if (mongoose.connection.readyState !== 1) {
        console.log('🔄 Attempting to reconnect to MongoDB...');
        connectDB().catch(console.error);
    }
}, 10000);

export default connectDB;