import express from "express";
import { 
  getProjects, 
  getProjectDetails,
  renderNewProjectForm,
  handleCreateProject,
  renderEditProjectForm,
  handleUpdateProject,
  renderAssignCategoriesForm,
  handleAssignCategories,
  handleDeleteProject
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/projects", getProjects);
router.get("/project/new", renderNewProjectForm);
router.post("/projects", handleCreateProject);
router.post("/project", handleCreateProject);
router.get("/project/:id", getProjectDetails);
router.get("/project/:id/edit", renderEditProjectForm);
router.post("/project/:id/edit", handleUpdateProject);

router.get("/project/:id/assign-categories", renderAssignCategoriesForm);
router.post("/project/:id/assign-categories", handleAssignCategories);

// Delete route handler
router.post("/project/:id/delete", handleDeleteProject);

export default router;