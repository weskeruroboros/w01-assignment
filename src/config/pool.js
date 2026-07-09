import pg from 'pg';
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config();

const { Pool } = pg;

// Connect using the connection string from your environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 🔒 SSL encryption is required to connect to Render from your local computer
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;