import pool from "../config/pool.js";

export async function getAllOrganizations() {
  const result = await pool.query("SELECT * FROM organizations ORDER BY name ASC;");
  return result.rows;
}

export async function getOrganizationById(id) {
  const result = await pool.query("SELECT * FROM organizations WHERE organization_id = $1;", [id]);
  return result.rows[0];
}

export async function getProjectsByOrganization(organizationId) {
  const result = await pool.query(
    "SELECT * FROM projects WHERE organization_id = $1 ORDER BY project_date DESC;",
    [organizationId]
  );
  return result.rows;
}

export async function createOrganization(orgData) {
  const result = await pool.query(
    `INSERT INTO organizations (name, email, image_url) 
     VALUES ($1, $2, $3) 
     RETURNING *;`,
    [orgData.name, orgData.email, orgData.image_url]
  );
  return result.rows[0];
}

export async function updateOrganization(id, orgData) {
  const result = await pool.query(
    `UPDATE organizations 
     SET name = $1, email = $2, image_url = $3 
     WHERE organization_id = $4 
     RETURNING *;`,
    [orgData.name, orgData.email, orgData.image_url, id]
  );
  return result.rows[0];
}