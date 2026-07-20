import express from "express";
import { 
  getProjects, 
  getProjectDetails,
  renderAssignCategoriesForm,
  handleAssignCategories
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/projects", getProjects);
router.get("/project/:id", getProjectDetails);

router.get("/project/:id/assign-categories", renderAssignCategoriesForm);
router.post("/project/:id/assign-categories", handleAssignCategories);

export default router;