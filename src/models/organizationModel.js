import pool from "../config/pool.js";

async function ensureSchema() {
  try {
    await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description TEXT;");
    await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS image_url TEXT;");
    
    // Automatically populate missing image URLs for existing database records
    await pool.query(
      `UPDATE organizations 
       SET image_url = '/images/home.jpg' 
       WHERE image_url IS NULL OR image_url = '';`
    );
  } catch (err) {
    console.error("Schema sync warning:", err.message);
  }
}
ensureSchema();

export async function getOrganizationsFromDB() {
  const result = await pool.query(
    `SELECT organization_id, name, description, email, image_url 
     FROM organizations 
     ORDER BY name ASC;`
  );
  return result.rows;
}

export async function getOrganizationByIdFromDB(organizationId) {
  const result = await pool.query(
    `SELECT organization_id, name, description, email, image_url 
     FROM organizations 
     WHERE organization_id = $1;`,
    [organizationId]
  );
  return result.rows[0] || null;
}

export async function getProjectsByOrganizationFromDB(organizationId) {
  const result = await pool.query(
    `SELECT * FROM projects WHERE organization_id = $1 ORDER BY project_date DESC;`,
    [organizationId]
  );
  return result.rows;
}

// Automatically assigns local default image /images/home.jpg if none provided
export async function createOrganizationInDB(name, description, email, imageUrl = "/images/home.jpg") {
  const result = await pool.query(
    `INSERT INTO organizations (name, description, email, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [name, description, email, imageUrl]
  );
  return result.rows[0];
}

export async function updateOrganizationInDB(organizationId, name, description, email, imageUrl) {
  const result = await pool.query(
    `UPDATE organizations
     SET name = $1, description = $2, email = $3, image_url = $4
     WHERE organization_id = $5
     RETURNING *;`,
    [name, description, email, imageUrl, organizationId]
  );
  return result.rows[0] || null;
}

export async function deleteOrganizationFromDB(organizationId) {
  await pool.query(`DELETE FROM projects WHERE organization_id = $1;`, [organizationId]);
  const result = await pool.query(`DELETE FROM organizations WHERE organization_id = $1;`, [organizationId]);
  return result.rowCount > 0;
}