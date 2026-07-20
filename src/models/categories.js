import pool from "../config/pool.js";

export async function getAllCategories() {
  const result = await pool.query(
    `SELECT category_id, name, description 
     FROM categories 
     ORDER BY name ASC;`
  );
  return result.rows;
}

export async function getCategoryById(categoryId) {
  const result = await pool.query(
    `SELECT category_id, name, description 
     FROM categories 
     WHERE category_id = $1;`,
    [categoryId]
  );
  return result.rows[0] || null;
}

export async function getProjectsByCategory(categoryId) {
  const result = await pool.query(
    `SELECT 
      p.project_id, 
      p.title, 
      p.description, 
      p.location, 
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS project_date
    FROM projects p
    JOIN project_categories pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date ASC;`,
    [categoryId]
  );
  return result.rows;
}

export async function createCategory(name, description = "") {
  const result = await pool.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING category_id, name, description;`,
    [name, description]
  );
  return result.rows[0];
}

export async function updateCategory(categoryId, name, description = "") {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1, description = $2
     WHERE category_id = $3
     RETURNING category_id, name, description;`,
    [name, description, categoryId]
  );
  return result.rows[0] || null;
}