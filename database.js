import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./src/config/pool.js"; 

// 1. Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log("Checking database schema setup...");
  try {
    // 2. Force look inside the 'src' folder relative to the root directory
    const sqlFilePath = path.resolve(__dirname, "src", "setup.sql");
    
    // This will print the exact path in your terminal to help us track it down
    console.log(`Searching for SQL file at: ${sqlFilePath}`); 

    const setupScript = fs.readFileSync(sqlFilePath, "utf-8");

    // 3. Execute the script against your PG pool
    await pool.query(setupScript);
    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
  }
}

initializeDatabase();

// 4. Export the pool for your models
export default pool;