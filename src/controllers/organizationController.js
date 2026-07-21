import { 
  getAllOrganizations, 
  getOrganizationById, 
  getProjectsByOrganization,
  createOrganization,
  updateOrganization
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

export function renderNewOrganizationForm(req, res) {
  res.render("newOrganization", { title: "Add Organization" });
}

export async function handleCreateOrganization(req, res, next) {
  try {
    const { name, description, location } = req.body;
    await createOrganization({ name, description, location });
    req.flash("success", "Organization created successfully!");
    res.redirect("/organizations");
  } catch (error) {
    next(error);
  }
}

export async function renderEditOrganizationForm(req, res, next) {
  try {
    const orgId = req.params.id;
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      req.flash("error", "Organization not found.");
      return res.redirect("/organizations");
    }
    res.render("editOrganization", { title: `Edit ${organization.name}`, organization });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateOrganization(req, res, next) {
  try {
    const orgId = req.params.id;
    const { name, description, location } = req.body;
    await updateOrganization(orgId, { name, description, location });
    req.flash("success", "Organization updated successfully!");
    res.redirect(`/organization/${orgId}`);
  } catch (error) {
    next(error);
  }
}