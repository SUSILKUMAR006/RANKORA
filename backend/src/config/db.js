import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rankora'
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'rankora',
    })
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`)
    console.log('[MongoDB] Running in offline mode or waiting for database startup.')
    return null
  }
}
