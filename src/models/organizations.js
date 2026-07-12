import pool from "../../database.js";

// Fetch all organizations for the list page
export async function getAllOrganizations() {
  const result = await pool.query(`SELECT * FROM organizations ORDER BY name;`);
  return result.rows;
}

// Fetch a single organization by its ID
export async function getOrganizationById(orgId) {
  const result = await pool.query(
    `SELECT * FROM organizations WHERE organization_id = $1;`, 
    [orgId]
  );
  return result.rows[0];
}

// Fetch all projects belonging to a specific organization
export async function getProjectsByOrganization(orgId) {
  const result = await pool.query(
    `SELECT project_id, title, description, location, TO_CHAR(project_date, 'YYYY-MM-DD') AS project_date 
     FROM projects 
     WHERE organization_id = $1 
     ORDER BY project_date;`, 
    [orgId]
  );
  return result.rows;
}