import express from "express";
import { 
  getOrganizations, 
  getOrganizationDetails,
  renderNewOrganizationForm,
  handleCreateOrganization,
  renderEditOrganizationForm,
  handleUpdateOrganization
} from "../controllers/organizationController.js";

const router = express.Router();

router.get("/organizations", getOrganizations);
router.get("/organization/new", renderNewOrganizationForm);
router.post("/organization", handleCreateOrganization);
router.get("/organization/:id", getOrganizationDetails);
router.get("/organization/:id/edit", renderEditOrganizationForm);
router.post("/organization/:id/edit", handleUpdateOrganization);

export default router;