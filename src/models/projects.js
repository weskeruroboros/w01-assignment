import pool from "../database.js";

export async function getAllProjects() {
  const result = await pool.query(`
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      o.name AS organization_name
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_date;
  `);

  return result.rows;
}