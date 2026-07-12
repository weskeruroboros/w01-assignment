import express from "express";
import { getProjects, getProjectDetails } from "../controllers/projectController.js";

const router = express.Router();

// Route for the main projects list page
router.get("/projects", getProjects);

// Route for a single project details page (e.g., /project/2)
router.get("/project/:id", getProjectDetails);

export default router;