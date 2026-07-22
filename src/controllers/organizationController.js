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
    console.error("Error loading organizations:", err);
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
    console.error("Error loading organization details:", err);
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
      return res.redirect("/organizations/new");
    }

    const safeDescription = description ? description.trim() : null;
    const safeEmail = email ? email.trim() : null;

    await createOrganizationInDB(trimmedName, safeDescription, safeEmail, "/images/home.jpg");
    req.flash("success", "Organization created successfully!");
    res.redirect("/organizations");
  } catch (err) {
    console.error("Error creating organization:", err);
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
    console.error("Error loading edit form:", err);
    res.status(500).send("Server Error");
  }
};

export const handleUpdateOrganization = async (req, res) => {
  try {
    const { name, description, email, image_url } = req.body;
    const trimmedName = name ? name.trim() : "";

    if (!trimmedName) {
      req.flash("error", "Organization name is required.");
      return res.redirect(`/organizations/${req.params.id}/edit`);
    }

    const safeDescription = description ? description.trim() : null;
    const safeEmail = email ? email.trim() : null;
    const safeImageUrl = image_url && image_url.trim() !== "" ? image_url.trim() : "/images/home.jpg";

    await updateOrganizationInDB(
      req.params.id, 
      trimmedName, 
      safeDescription, 
      safeEmail, 
      safeImageUrl
    );

    req.flash("success", "Organization updated successfully!");
    res.redirect("/organizations");
  } catch (err) {
    console.error("Error updating organization:", err);
    req.flash("error", "Failed to update organization.");
    res.redirect(`/organizations/${req.params.id}/edit`);
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    await deleteOrganizationFromDB(req.params.id);
    req.flash("success", "Organization deleted successfully!");
    res.redirect("/organizations");
  } catch (err) {
    console.error("Error deleting organization:", err);
    req.flash("error", "Failed to delete organization.");
    res.redirect("/organizations");
  }
};