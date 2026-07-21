import express from "express";
import {
  getOrganizations,
  getOrganizationDetails,
  getNewOrganizationForm,
  handleCreateOrganization,
  renderEditOrganizationForm,
  handleUpdateOrganization,
  deleteOrganization
} from "../controllers/organizationController.js";

const router = express.Router();

// Plural Routes
router.get("/organizations", getOrganizations);
router.get("/organizations/new", getNewOrganizationForm);
router.post("/organizations", handleCreateOrganization);
router.get("/organizations/:id", getOrganizationDetails);
router.get("/organizations/:id/edit", renderEditOrganizationForm);
router.post("/organizations/:id/edit", handleUpdateOrganization);
router.post("/organizations/:id/delete", deleteOrganization);

// Singular Route Aliases (Fixes 'Cannot GET /organization/...')
router.get("/organization/new", getNewOrganizationForm);
router.post("/organization", handleCreateOrganization);
router.get("/organization/:id", getOrganizationDetails);
router.get("/organization/:id/edit", renderEditOrganizationForm);
router.post("/organization/:id/edit", handleUpdateOrganization);
router.post("/organization/:id/delete", deleteOrganization);

export default router;