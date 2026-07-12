import { getAllOrganizations, getOrganizationById, getProjectsByOrganization } from "../models/organizations.js";

// Display all partner organizations
export async function getOrganizations(req, res, next) {
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { title: "Organizations", organizations });
  } catch (error) { 
    next(error); 
  }
}

// Display details for a single organization
export async function getOrganizationDetails(req, res, next) {
  try {
    const orgId = req.params.id;
    const organization = await getOrganizationById(orgId);
    
    if (!organization) {
      const err = new Error("Organization Not Found");
      err.status = 404;
      return next(err);
    }
    
    const projects = await getProjectsByOrganization(orgId);
    res.render("organizationDetails", { title: organization.name, organization, projects });
  } catch (error) { 
    next(error); 
  }
}