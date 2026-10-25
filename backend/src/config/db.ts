import dns from 'dns';
import mongoose from 'mongoose';

// Ensure SRV records resolve smoothly on Windows / local ISP networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom DNS cannot be set
}

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.includes('<db_password>')) {
      console.warn(
        '⚠️ MONGODB_URI is not configured or still contains <db_password> placeholder. Please update backend/.env'
      );
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
};
