import pool from "../config/pool.js";

export async function getAllOrganizations() {
  const result = await pool.query(
    `SELECT organization_id, name, email, image_url 
     FROM organizations 
     ORDER BY name ASC;`
  );
  return result.rows;
}

export async function getOrganizationById(orgId) {
  const result = await pool.query(
    `SELECT organization_id, name, email, image_url 
     FROM organizations 
     WHERE organization_id = $1;`,
    [orgId]
  );
  return result.rows[0] || null;
}

export async function getProjectsByOrganization(orgId) {
  const result = await pool.query(
    `SELECT 
       project_id, 
       title, 
       description, 
       location, 
       TO_CHAR(project_date, 'YYYY-MM-DD') AS project_date 
     FROM projects 
     WHERE organization_id = $1 
     ORDER BY project_date ASC;`,
    [orgId]
  );
  return result.rows;
}