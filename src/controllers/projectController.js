import { getAllProjects, getProjectById, getCategoriesByProject } from "../models/projects.js";

// Display all service projects
export async function getProjects(req, res, next) {
  try {
    const projects = await getAllProjects();
    res.render("projects", { title: "Service Projects", projects });
  } catch (error) { 
    next(error); 
  }
}

// Display details for a single service project
export async function getProjectDetails(req, res, next) {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    
    if (!project) {
      const err = new Error("Project Not Found");
      err.status = 404;
      return next(err);
    }
    
    const categories = await getCategoriesByProject(projectId);
    res.render("projectDetails", { title: project.title, project, categories });
  } catch (error) { 
    next(error); 
  }
}