DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;

-- ORGANIZATIONS
CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  image_url TEXT
);

-- PROJECTS
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  project_date DATE NOT NULL,

  FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
);

-- CATEGORIES
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- JUNCTION TABLE (MANY TO MANY)
CREATE TABLE project_categories (
  project_id INT NOT NULL,
  category_id INT NOT NULL,

  PRIMARY KEY (project_id, category_id),

  FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,

  FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
    ON DELETE CASCADE
);

-- SAMPLE ORGANIZATIONS
INSERT INTO organizations (name, email, image_url)
VALUES
('Red Cross', 'help@redcross.org', '/images/redcross.jpg'),
('UNICEF', 'contact@unicef.org', '/images/unicef.jpg'),
('Habitat for Humanity', 'info@habitat.org', '/images/habitat.jpg');

-- SAMPLE PROJECTS
INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES
(1, 'Community Cleanup', 'Cleaning local parks', 'Duhok', '2026-08-10'),
(1, 'Food Drive', 'Collecting food donations', 'Zakho', '2026-08-15'),
(2, 'School Support', 'Support education programs', 'Erbil', '2026-08-20'),
(3, 'Home Building', 'Build homes for families', 'Duhok', '2026-09-01'),
(2, 'Health Awareness', 'Health education campaign', 'Mosul', '2026-09-10');

-- SAMPLE CATEGORIES
INSERT INTO categories (name)
VALUES
('Environmental'),
('Education'),
('Health'),
('Community Service');

-- PROJECT ↔ CATEGORY LINKS
INSERT INTO project_categories (project_id, category_id)
VALUES
(1,1),
(1,4),
(2,4),
(3,2),
(4,4),
(5,3);