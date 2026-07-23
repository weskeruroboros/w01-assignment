import { validationResult } from "express-validator";
import { 
  getAllProjects, 
  getProjectById, 
  getCategoriesByProject,
  updateProjectCategories,
  createProject,
  updateProject,
  deleteProject
} from "../models/projectModel.js";
import { getAllCategories } from "../models/categoryModel.js";
import { getAllOrganizations } from "../models/organizationModel.js";

export const getProjects = async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    res.render("projects", { title: "Service Projects", projects });
  } catch (error) { 
    next(error); 
  }
};

export const getProjectDetails = async (req, res, next) => {
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
};

export const renderNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    res.render("newProject", { title: "Add Project", organizations, errors: [] });
  } catch (error) {
    next(error);
  }
};

export const handleCreateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const organizations = await getAllOrganizations();
      return res.status(400).render("newProject", { 
        title: "Add Project", 
        organizations, 
        errors: errors.array(), 
        oldData: req.body 
      });
    } catch (orgErr) {
      return next(orgErr);
    }
  }

  try {
    const { title, organization_id, location, project_date, description } = req.body;
    await createProject({ title, organization_id, location, project_date, description });
    req.flash("success", "Project created successfully!");
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
};

export const renderEditProjectForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    if (!project) {
      req.flash("error", "Project not found.");
      return res.redirect("/projects");
    }
    const organizations = await getAllOrganizations();
    res.render("editProject", { title: `Edit ${project.title}`, project, organizations, errors: [] });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateProject = async (req, res, next) => {
  const errors = validationResult(req);
  const projectId = req.params.id;

  if (!errors.isEmpty()) {
    try {
      const project = await getProjectById(projectId);
      const organizations = await getAllOrganizations();
      return res.status(400).render("editProject", { 
        title: `Edit ${project ? project.title : 'Project'}`, 
        project: { ...project, ...req.body }, 
        organizations, 
        errors: errors.array() 
      });
    } catch (renderErr) {
      return next(renderErr);
    }
  }

  try {
    const { title, organization_id, location, project_date, description } = req.body;
    await updateProject(projectId, { title, organization_id, location, project_date, description });
    req.flash("success", "Project updated successfully!");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (isNaN(projectId)) {
      const err = new Error("Invalid Project ID");
      err.status = 400;
      return next(err);
    }

    await deleteProject(projectId);
    req.flash("success", "Project deleted successfully!");
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
};

export const renderAssignCategoriesForm = async (req, res, next) => {
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
};

export const handleAssignCategories = async (req, res, next) => {
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
};