import pool from "../config/pool.js";

export async function getCategoriesFromDB() {
  const result = await pool.query(
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
  return result.rows;
}

export async function getCategoryByIdFromDB(categoryId) {
  const result = await pool.query(
    `SELECT category_id, name 
     FROM categories 
     WHERE category_id = $1;`,
    [categoryId]
  );
  return result.rows[0] || null;
}

export async function createCategoryInDB(name) {
  const result = await pool.query(
    `INSERT INTO categories (name)
     VALUES ($1)
     RETURNING category_id, name;`,
    [name]
  );
  return result.rows[0];
}

export async function updateCategoryInDB(categoryId, name) {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1
     WHERE category_id = $2
     RETURNING category_id, name;`,
    [name, categoryId]
  );
  return result.rows[0] || null;
}

export async function deleteCategoryFromDB(categoryId) {
  await pool.query(`DELETE FROM project_categories WHERE category_id = $1;`, [categoryId]);
  const result = await pool.query(`DELETE FROM categories WHERE category_id = $1;`, [categoryId]);
  return result.rowCount > 0;
}

export async function getAllProjectsForNewCategory() {
  const result = await pool.query(
    `SELECT project_id, title FROM projects ORDER BY title ASC;`
  );
  return result.rows;
}

export async function getAllProjectsWithSelection(categoryId) {
  const result = await pool.query(
    `SELECT p.project_id, p.title, 
            CASE WHEN pc.category_id IS NOT NULL THEN true ELSE false END AS is_checked
     FROM projects p
     LEFT JOIN project_categories pc ON p.project_id = pc.project_id AND pc.category_id = $1
     ORDER BY p.title ASC;`,
    [categoryId]
  );
  return result.rows;
}

export async function updateCategoryProjects(categoryId, projectIds = []) {
  await pool.query(`DELETE FROM project_categories WHERE category_id = $1;`, [categoryId]);
  
  if (projectIds) {
    const ids = Array.isArray(projectIds) ? projectIds : [projectIds];
    for (const projectId of ids) {
      await pool.query(
        `INSERT INTO project_categories (category_id, project_id) VALUES ($1, $2);`,
        [categoryId, projectId]
      );
    }
  }
}