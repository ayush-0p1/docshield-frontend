const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoDB(uri) {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then((mongoose) => {
                return mongoose;
            })
            .catch((err) => {
                cached.promise = null; // Reset the promise on failure
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = { connectToMongoDB };
