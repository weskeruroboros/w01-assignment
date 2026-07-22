import pool from "../config/pool.js";

/**
 * Sanitizes and trims project input payload.
 */
const sanitize = ({ title, organization_id, location, project_date, description }) => ({
  title: title?.trim() ?? "",
  organizationId: organization_id && organization_id !== "" ? organization_id : null,
  location: location?.trim() || null,
  projectDate: project_date?.trim() || null,
  description: description?.trim() ?? ""
});

/**
 * Fetch all projects with organization details and aggregated categories.
 */
export async function getAllProjects() {
  const { rows } = await pool.query(`
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
  return rows;
}

/**
 * Fetch a single project by its ID with organization details.
 */
export async function getProjectById(projectId) {
  const { rows } = await pool.query(`
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
  
  return rows[0] || null;
}

/**
 * Fetch categories linked to a specific project.
 */
export async function getCategoriesByProject(projectId) {
  const { rows } = await pool.query(`
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `, [projectId]);
  
  return rows;
}

/**
 * Transaction-safe update for assigning/unassigning categories.
 */
export async function updateProjectCategories(projectId, categoryIds = []) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM project_categories WHERE project_id = $1;", [projectId]);

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

/**
 * Create a new project record.
 */
export async function createProject(projectData) {
  const { title, organizationId, location, projectDate, description } = sanitize(projectData);

  const { rows } = await pool.query(
    `INSERT INTO projects (title, organization_id, location, project_date, description) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *;`,
    [title, organizationId, location, projectDate, description]
  );
  return rows[0];
}

/**
 * Update an existing project record.
 */
export async function updateProject(projectId, projectData) {
  const { title, organizationId, location, projectDate, description } = sanitize(projectData);

  const { rows } = await pool.query(
    `UPDATE projects 
     SET title = $1, organization_id = $2, location = $3, project_date = $4, description = $5 
     WHERE project_id = $6 
     RETURNING *;`,
    [title, organizationId, location, projectDate, description, projectId]
  );
  return rows[0];
}

/**
 * Delete a project and its associated category relations.
 */
export async function deleteProject(projectId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM project_categories WHERE project_id = $1;", [projectId]);
    await client.query("DELETE FROM projects WHERE project_id = $1;", [projectId]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}