import pool from "../config/pool.js";

// Fetch all categories
export const getCategoriesFromDB = async () => {
  const result = await pool.query("SELECT * FROM categories ORDER BY category_id ASC");
  return result.rows;
};

// Create a new category
export const createCategoryInDB = async (categoryData) => {
  const { name, description } = categoryData;
  const result = await pool.query(
    "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );
  return result.rows[0];
};

// Find a single category by ID
export const getCategoryByIdFromDB = async (id) => {
  const result = await pool.query("SELECT * FROM categories WHERE category_id = $1", [id]);
  return result.rows[0];
};

// Update an existing category
export const updateCategoryInDB = async (id, categoryData) => {
  const { name, description } = categoryData;
  const result = await pool.query(
    "UPDATE categories SET name = $1, description = $2 WHERE category_id = $3 RETURNING *",
    [name, description, id]
  );
  return result.rows[0];
};

// Delete a category
export const deleteCategoryFromDB = async (id) => {
  await pool.query("DELETE FROM categories WHERE category_id = $1", [id]);
};