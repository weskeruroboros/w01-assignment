import pg from "pg";
const { Pool } = pg;

// Checks if we are running on Render cloud or locally
const isProduction = process.env.NODE_ENV === "production" || process.env.DATABASE_URL?.includes("render.com");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If running on Render cloud, require SSL. If local, completely disable it.
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export default pool;