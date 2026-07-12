import pool from "../../database.js";

// Fetch all projects for the main list page (including separated category arrays)
export async function getAllProjects() {
  const result = await pool.query(`
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS project_date,
      p.organization_id,              
      o.name AS organization_name,
      STRING_AGG(c.name, ',') AS categories,      
      STRING_AGG(CAST(c.category_id AS TEXT), ',') AS category_ids 
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    LEFT JOIN project_categories pc ON p.project_id = pc.project_id
    LEFT JOIN categories c ON pc.category_id = c.category_id
    GROUP BY p.project_id, o.name, p.organization_id
    ORDER BY p.project_date;
  `);
  return result.rows;
}

// Fetch a single service project by its ID
export async function getProjectById(projectId) {
  const result = await pool.query(`
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location,
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS project_date,
      p.organization_id,
      o.name AS organization_name
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `, [projectId]);
  return result.rows[0];
}

// Fetch all individual categories assigned to a specific project
export async function getCategoriesByProject(projectId) {
  const result = await pool.query(`
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `, [projectId]);
  return result.rows;
}