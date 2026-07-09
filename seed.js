import 'dotenv/config'; // 🌟 Added to load your environment variables automatically
import fs from 'fs';
import path from 'path';
import pool from './database.js';

async function runSeed() {
  try {
    console.log("Reading setup.sql file...");
    const sqlPath = path.join(process.cwd(), 'setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Executing SQL Schema...");
    await pool.query(sql);

    console.log("✨ SUCCESS! All database tables created and populated successfully.");
  } catch (error) {
    console.error("❌ SEEDING FAILED:", error.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

runSeed();