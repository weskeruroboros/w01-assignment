import express from "express";
import { getOrganizations, getOrganizationDetails } from "../controllers/organizationController.js";

const router = express.Router();

// Route for the main organizations list page
router.get("/organizations", getOrganizations);

// Route for a single organization details page (e.g., /organization/4)
router.get("/organization/:id", getOrganizationDetails);

export default router;