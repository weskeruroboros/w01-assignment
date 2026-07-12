import pool from "../../database.js";

// Fetch all categories for the main list page
export async function getAllCategories() {
  const result = await pool.query(`SELECT * FROM categories ORDER BY name;`);
  return result.rows;
}

// Retrieve a single category by its ID
export async function getCategoryById(categoryId) {
  const result = await pool.query(
    `SELECT * FROM categories WHERE category_id = $1;`, 
    [categoryId]
  );
  return result.rows[0];
}

// Retrieve all service projects associated with a specific category
export async function getProjectsByCategory(categoryId) {
  const result = await pool.query(`
    SELECT p.project_id, p.title, p.description, p.location, TO_CHAR(p.project_date, 'YYYY-MM-DD') AS project_date
    FROM projects p
    JOIN project_categories pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date;
  `, [categoryId]);
  return result.rows;
}