import { 
  getAllOrganizations, 
  getOrganizationById, 
  getProjectsByOrganization 
} from "../models/organizations.js";

export async function getOrganizations(req, res, next) {
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { title: "Organizations", organizations });
  } catch (error) { 
    next(error); 
  }
}

export async function getOrganizationDetails(req, res, next) {
  try {
    const orgId = req.params.id;

    if (isNaN(orgId)) {
      const err = new Error("Invalid Organization ID");
      err.status = 400;
      return next(err);
    }

    const organization = await getOrganizationById(orgId);
    
    if (!organization) {
      const err = new Error("Organization Not Found");
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByOrganization(orgId);
    
    res.render("organizationDetails", { 
      title: organization.name, 
      organization, 
      projects 
    });
  } catch (error) { 
    next(error); 
  }
}