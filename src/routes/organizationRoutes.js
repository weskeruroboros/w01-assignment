import express from "express";
import { getOrganizations, getOrganizationDetails } from "../controllers/organizationController.js";

const router = express.Router();

router.get("/organizations", getOrganizations);
router.get("/organization/:id", getOrganizationDetails);

export default router;