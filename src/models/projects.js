import pool from "../../database.js";

export async function getAllProjects() {
  const result = await pool.query(`
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS project_date,
      o.name AS organization_name,
      COALESCE(STRING_AGG(c.name, ', '), 'Uncategorized') AS categories
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    LEFT JOIN project_categories pc ON p.project_id = pc.project_id
    LEFT JOIN categories c ON pc.category_id = c.category_id
    GROUP BY p.project_id, o.name
    ORDER BY p.project_date;
  `);
  return result.rows;
}
