import pool from "../config/pool.js";

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

export async function getCategoriesByProject(projectId) {
  const result = await pool.query(`
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `, [projectId]);
  
  return result.rows;
}

export async function updateProjectCategories(projectId, categoryIds = []) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Clear existing assignments
    await client.query("DELETE FROM project_categories WHERE project_id = $1;", [projectId]);

    // Insert new selected assignments
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

export async function createProject(projectData) {
  const result = await pool.query(
    `INSERT INTO projects (title, organization_id, location, project_date, description) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *;`,
    [projectData.title, projectData.organization_id, projectData.location, projectData.project_date, projectData.description]
  );
  return result.rows[0];
}

export async function updateProject(projectId, projectData) {
  const result = await pool.query(
    `UPDATE projects 
     SET title = $1, organization_id = $2, location = $3, project_date = $4, description = $5 
     WHERE project_id = $6 
     RETURNING *;`,
    [projectData.title, projectData.organization_id, projectData.location, projectData.project_date, projectData.description, projectId]
  );
  return result.rows[0];
}