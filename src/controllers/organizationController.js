import { 
  getOrganizationsFromDB, 
  getOrganizationByIdFromDB, 
  getProjectsByOrganizationFromDB,
  createOrganizationInDB, 
  updateOrganizationInDB, 
  deleteOrganizationFromDB 
} from "../models/organizationModel.js";

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await getOrganizationsFromDB();
    res.render("organizations", { title: "Organizations", organizations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const getOrganizationDetails = async (req, res) => {
  try {
    const organization = await getOrganizationByIdFromDB(req.params.id);
    if (!organization) {
      req.flash("error", "Organization not found.");
      return res.redirect("/organizations");
    }

    const projects = await getProjectsByOrganizationFromDB(req.params.id);

    res.render("organizationDetails", { 
      title: organization.name, 
      organization, 
      projects 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const getNewOrganizationForm = (req, res) => {
  res.render("newOrganization", { title: "Add New Organization" });
};

export const handleCreateOrganization = async (req, res) => {
  try {
    const { name, description, email } = req.body;
    const trimmedName = name ? name.trim() : "";

    if (!trimmedName) {
      req.flash("error", "Organization name is required.");
      return res.redirect("back");
    }

    await createOrganizationInDB(trimmedName, description, email);
    req.flash("success", "Organization created successfully!");
    res.redirect("/organizations");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create organization.");
    res.redirect("/organizations/new");
  }
};

export const renderEditOrganizationForm = async (req, res) => {
  try {
    const organization = await getOrganizationByIdFromDB(req.params.id);
    if (!organization) {
      req.flash("error", "Organization not found.");
      return res.redirect("/organizations");
    }
    res.render("editOrganization", { title: "Edit Organization", organization });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const handleUpdateOrganization = async (req, res) => {
  try {
    const { name, description, email, image_url } = req.body;
    const trimmedName = name ? name.trim() : "";

    if (!trimmedName) {
      req.flash("error", "Organization name is required.");
      return res.redirect("back");
    }

    await updateOrganizationInDB(req.params.id, trimmedName, description, email, image_url);
    req.flash("success", "Organization updated successfully!");
    res.redirect("/organizations");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update organization.");
    res.redirect(`/organizations/${req.params.id}/edit`);
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    await deleteOrganizationFromDB(req.params.id);
    req.flash("success", "Organization removed successfully!");
    res.redirect("/organizations");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to remove organization.");
    res.redirect("/organizations");
  }
};