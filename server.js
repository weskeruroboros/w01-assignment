import 'dotenv/config'; // 🌟 Added to load environment variables before database calls
import express from "express";
import fs from "fs";
import path from "path";
import pool from "./database.js";
import { getAllProjects } from "./src/models/projects.js";
import { getAllCategories } from "./src/models/categories.js";
import { getAllOrganizations } from "./src/models/organizations.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// 🌟 AUTOMATIC BACKGROUND DATABASE BLUEPRINT INITIALIZER
async function autoSeedDatabase() {
  try {
    console.log("Checking database schema setup...");
    const sqlPath = path.join(process.cwd(), "setup.sql");
    const sqlScript = fs.readFileSync(sqlPath, "utf8");
    await pool.query(sqlScript);
    console.log("✨ SUCCESS: Cloud database tables built and loaded cleanly!");
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
  }
}
await autoSeedDatabase();

/* HOME */
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

/* ORGANIZATIONS */
app.get("/organizations", async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { title: "Organizations", organizations });
  } catch (error) {
    console.error("❌ ERROR /organizations:", error.message);
    res.status(500).send("Database Error");
  }
});

/* PROJECTS */
app.get("/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render("projects", { title: "Service Projects", projects });
  } catch (error) {
    console.error("❌ ERROR /projects:", error.message);
    res.status(500).send("Database Error");
  }
});

/* CATEGORIES */
app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render("categories", { title: "Service Project Categories", categories });
  } catch (error) {
    console.error("❌ ERROR /categories:", error.message);
    res.status(500).send("Database Error");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running smoothly on http://localhost:${PORT}`);
});