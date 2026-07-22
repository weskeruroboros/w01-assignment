import pool from "../config/pool.js";

// Fetch all projects with organization details and aggregated categories (formatted for pill tags)
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
      STRING_AGG(DISTINCT c.name, ',') AS categories,      
      STRING_AGG(DISTINCT c.category_id::TEXT, ',') AS category_ids 
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    LEFT JOIN project_categories pc ON p.project_id = pc.project_id
    LEFT JOIN categories c ON pc.category_id = c.category_id
    GROUP BY p.project_id, o.name, o.organization_id
    ORDER BY p.project_date ASC;
  `);
  return result.rows;
}

// Fetch a single project by its ID
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
  
  return result.rows[0] || null;
}

// Fetch categories linked to a specific project
export async function getCategoriesByProject(projectId) {
  const result = await pool.query(`
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `, [projectId]);
  
  return result.rows;
}

// Transaction-safe update for assigning/unassigning categories
export async function updateProjectCategories(projectId, categoryIds = []) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Clear existing category assignments
    await client.query("DELETE FROM project_categories WHERE project_id = $1;", [projectId]);

    // Insert new selected category assignments
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    for (const catId of ids) {
      if (catId) {
        await client.query(
          "INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2);",
          [projectId, catId]
        );
      }
    }
    
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Create a new project record with safe sanitization for empty strings
export async function createProject(projectData) {
  const safeOrgId = projectData.organization_id && projectData.organization_id !== "" ? projectData.organization_id : null;
  const safeLocation = projectData.location && projectData.location.trim() !== "" ? projectData.location.trim() : null;
  const safeDate = projectData.project_date && projectData.project_date.trim() !== "" ? projectData.project_date : null;
  const safeDescription = projectData.description ? projectData.description.trim() : "";

  const result = await pool.query(
    `INSERT INTO projects (title, organization_id, location, project_date, description) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *;`,
    [projectData.title.trim(), safeOrgId, safeLocation, safeDate, safeDescription]
  );
  return result.rows[0];
}

// Update an existing project record with safe sanitization for empty strings
export async function updateProject(projectId, projectData) {
  const safeOrgId = projectData.organization_id && projectData.organization_id !== "" ? projectData.organization_id : null;
  const safeLocation = projectData.location && projectData.location.trim() !== "" ? projectData.location.trim() : null;
  const safeDate = projectData.project_date && projectData.project_date.trim() !== "" ? projectData.project_date : null;
  const safeDescription = projectData.description ? projectData.description.trim() : "";

  const result = await pool.query(
    `UPDATE projects 
     SET title = $1, organization_id = $2, location = $3, project_date = $4, description = $5 
     WHERE project_id = $6 
     RETURNING *;`,
    [projectData.title.trim(), safeOrgId, safeLocation, safeDate, safeDescription, projectId]
  );
  return result.rows[0];
}