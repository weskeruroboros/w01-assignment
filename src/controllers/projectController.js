import { 
  getAllProjects, 
  getProjectById, 
  getCategoriesByProject,
  updateProjectCategories 
} from "../models/projects.js";
import { getAllCategories } from "../models/categories.js";

export async function getProjects(req, res, next) {
  try {
    const projects = await getAllProjects();
    res.render("projects", { title: "Service Projects", projects });
  } catch (error) { 
    next(error); 
  }
}

export async function getProjectDetails(req, res, next) {
  try {
    const projectId = req.params.id;

    if (isNaN(projectId)) {
      const err = new Error("Invalid Project ID");
      err.status = 400;
      return next(err);
    }

    const project = await getProjectById(projectId);
    
    if (!project) {
      const err = new Error("Project Not Found");
      err.status = 404;
      return next(err);
    }
    
    const categories = await getCategoriesByProject(projectId);
    
    res.render("projectDetails", { 
      title: project.title, 
      project, 
      categories 
    });
  } catch (error) { 
    next(error); 
  }
}

export async function renderAssignCategoriesForm(req, res, next) {
  try {
    const projectId = req.params.id;
    if (isNaN(projectId)) {
      const err = new Error("Invalid Project ID");
      err.status = 400;
      return next(err);
    }

    const project = await getProjectById(projectId);
    if (!project) {
      req.flash("error", "Project not found.");
      return res.redirect("/projects");
    }

    const allCategories = await getAllCategories();
    const currentCategories = await getCategoriesByProject(projectId);
    const assignedCategoryIds = currentCategories.map(c => Number(c.category_id));

    res.render("assignCategories", {
      title: `Assign Categories - ${project.title}`,
      project,
      allCategories,
      assignedCategoryIds
    });
  } catch (error) {
    next(error);
  }
}

export async function handleAssignCategories(req, res, next) {
  try {
    const projectId = req.params.id;
    if (isNaN(projectId)) {
      const err = new Error("Invalid Project ID");
      err.status = 400;
      return next(err);
    }

    const { categoryIds } = req.body;
    await updateProjectCategories(projectId, categoryIds || []);

    req.flash("success", "Project categories updated successfully!");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}