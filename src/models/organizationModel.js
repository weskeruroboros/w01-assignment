import pool from "../config/pool.js";

/**
 * Ensures required columns exist in the organizations table and sets default images.
 */
async function ensureSchema() {
  try {
    await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description TEXT;");
    await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS image_url TEXT;");
    
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

/**
 * Fetch all organizations ordered by name alphabetically.
 */
export async function getOrganizationsFromDB() {
  const { rows } = await pool.query(
    `SELECT organization_id, name, description, email, image_url 
     FROM organizations 
     ORDER BY name ASC;`
  );
  return rows;
}

// Export alias to satisfy controller requirements
export const getAllOrganizations = getOrganizationsFromDB;

/**
 * Fetch a single organization by its ID.
 */
export async function getOrganizationByIdFromDB(organizationId) {
  const { rows } = await pool.query(
    `SELECT organization_id, name, description, email, image_url 
     FROM organizations 
     WHERE organization_id = $1;`,
    [organizationId]
  );
  return rows[0] || null;
}

/**
 * Fetch all projects associated with a specific organization.
 */
export async function getProjectsByOrganizationFromDB(organizationId) {
  const { rows } = await pool.query(
    `SELECT * FROM projects WHERE organization_id = $1 ORDER BY project_date DESC;`,
    [organizationId]
  );
  return rows;
}

/**
 * Create a new organization record.
 */
export async function createOrganizationInDB(name, description, email, imageUrl = "/images/home.jpg") {
  const { rows } = await pool.query(
    `INSERT INTO organizations (name, description, email, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [name?.trim(), description?.trim(), email?.trim(), imageUrl || "/images/home.jpg"]
  );
  return rows[0];
}

/**
 * Update an existing organization record.
 */
export async function updateOrganizationInDB(organizationId, name, description, email, imageUrl) {
  const { rows } = await pool.query(
    `UPDATE organizations
     SET name = $1, description = $2, email = $3, image_url = $4
     WHERE organization_id = $5
     RETURNING *;`,
    [name?.trim(), description?.trim(), email?.trim(), imageUrl, organizationId]
  );
  return rows[0] || null;
}

/**
 * Delete an organization and its associated projects.
 */
export async function deleteOrganizationFromDB(organizationId) {
  await pool.query(`DELETE FROM projects WHERE organization_id = $1;`, [organizationId]);
  const result = await pool.query(`DELETE FROM organizations WHERE organization_id = $1;`, [organizationId]);
  return result.rowCount > 0;
}