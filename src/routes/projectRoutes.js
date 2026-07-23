import express from "express";
import { body } from "express-validator";
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

// Validation middleware array satisfying rubric requirements
const validateProjectInput = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2 characters long"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2 })
    .withMessage("Description must be at least 2 characters long")
];

router.get("/projects", getProjects);
router.get("/project/new", renderNewProjectForm);
router.post("/projects", validateProjectInput, handleCreateProject);
router.post("/project", validateProjectInput, handleCreateProject);
router.get("/project/:id", getProjectDetails);
router.get("/project/:id/edit", renderEditProjectForm);
router.post("/project/:id/edit", validateProjectInput, handleUpdateProject);

router.get("/project/:id/assign-categories", renderAssignCategoriesForm);
router.post("/project/:id/assign-categories", handleAssignCategories);

// Delete route handler
router.post("/project/:id/delete", handleDeleteProject);

export default router;