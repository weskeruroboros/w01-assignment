import pool from "../config/pool.js";

/**
 * Fetch all categories along with their associated projects as a JSON array.
 */
export async function getCategoriesFromDB() {
  const { rows } = await pool.query(
    `SELECT 
        c.category_id, 
        c.name,
        COALESCE(
          json_agg(json_build_object('project_id', p.project_id, 'title', p.title)) 
          FILTER (WHERE p.project_id IS NOT NULL), '[]'
        ) AS projects
     FROM categories c
     LEFT JOIN project_categories pc ON c.category_id = pc.category_id
     LEFT JOIN projects p ON pc.project_id = p.project_id
     GROUP BY c.category_id, c.name
     ORDER BY c.name ASC;`
  );
  return rows;
}

// Export alias to satisfy projectController import
export const getAllCategories = getCategoriesFromDB;

/**
 * Fetch a single category by its ID.
 */
export async function getCategoryByIdFromDB(categoryId) {
  const { rows } = await pool.query(
    `SELECT category_id, name 
     FROM categories 
     WHERE category_id = $1;`,
    [categoryId]
  );
  return rows[0] || null;
}

/**
 * Create a new category record.
 */
export async function createCategoryInDB(name) {
  const { rows } = await pool.query(
    `INSERT INTO categories (name)
     VALUES ($1)
     RETURNING category_id, name;`,
    [name?.trim()]
  );
  return rows[0];
}

/**
 * Update an existing category record.
 */
export async function updateCategoryInDB(categoryId, name) {
  const { rows } = await pool.query(
    `UPDATE categories
     SET name = $1
     WHERE category_id = $2
     RETURNING category_id, name;`,
    [name?.trim(), categoryId]
  );
  return rows[0] || null;
}

/**
 * Delete a category and its relationship links.
 */
export async function deleteCategoryFromDB(categoryId) {
  await pool.query(`DELETE FROM project_categories WHERE category_id = $1;`, [categoryId]);
  const result = await pool.query(`DELETE FROM categories WHERE category_id = $1;`, [categoryId]);
  return result.rowCount > 0;
}

/**
 * Fetch all projects for selection views.
 */
export async function getAllProjectsForNewCategory() {
  const { rows } = await pool.query(
    `SELECT project_id, title FROM projects ORDER BY title ASC;`
  );
  return rows;
}

/**
 * Fetch all projects with a selection flag for a given category.
 */
export async function getAllProjectsWithSelection(categoryId) {
  const { rows } = await pool.query(
    `SELECT p.project_id, p.title, 
            CASE WHEN pc.category_id IS NOT NULL THEN true ELSE false END AS is_checked
     FROM projects p
     LEFT JOIN project_categories pc ON p.project_id = pc.project_id AND pc.category_id = $1
     ORDER BY p.title ASC;`,
    [categoryId]
  );
  return rows;
}

/**
 * Update projects linked to a specific category.
 */
export async function updateCategoryProjects(categoryId, projectIds = []) {
  await pool.query(`DELETE FROM project_categories WHERE category_id = $1;`, [categoryId]);
  
  if (projectIds) {
    const ids = Array.isArray(projectIds) ? projectIds : [projectIds];
    for (const projectId of ids) {
      if (projectId) {
        await pool.query(
          `INSERT INTO project_categories (category_id, project_id) VALUES ($1, $2);`,
          [categoryId, projectId]
        );
      }
    }
  }
}