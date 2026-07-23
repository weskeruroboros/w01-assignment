import express from "express";
import { body } from "express-validator";
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

// Validation middleware for organizations
const validateOrganizationInput = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 2 })
    .withMessage("Organization name must be at least 2 characters long")
];

// Primary Plural Routes
router.get("/organizations", getOrganizations);
router.get("/organizations/new", getNewOrganizationForm);
router.post("/organizations", validateOrganizationInput, handleCreateOrganization);
router.get("/organizations/:id", getOrganizationDetails);
router.get("/organizations/:id/edit", renderEditOrganizationForm);
router.post("/organizations/:id/edit", validateOrganizationInput, handleUpdateOrganization);
router.post("/organizations/:id/delete", deleteOrganization);

// Singular Route Aliases
router.get("/organization/new", getNewOrganizationForm);
router.post("/organization", validateOrganizationInput, handleCreateOrganization);
router.get("/organization/:id", getOrganizationDetails);
router.get("/organization/:id/edit", renderEditOrganizationForm);
router.post("/organization/:id/edit", validateOrganizationInput, handleUpdateOrganization);
router.post("/organization/:id/delete", deleteOrganization);

export default router;