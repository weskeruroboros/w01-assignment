import { 
  getCategoriesFromDB, 
  createCategoryInDB, 
  getCategoryByIdFromDB, 
  updateCategoryInDB, 
  deleteCategoryFromDB 
} from "../models/categoryModel.js";

// Render all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesFromDB();
    res.render("categories", { title: "Categories", categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Render the form to create a new category
export const getNewCategoryForm = (req, res) => {
  res.render("newCategory", { title: "Add New Category" });
};

// Handle creation logic
export const createCategory = async (req, res) => {
  try {
    await createCategoryInDB(req.body);
    req.flash("success", "Category created successfully!");
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create category.");
    res.redirect("/new-category");
  }
};

// Render the edit form
export const getEditCategoryForm = async (req, res) => {
  try {
    const category = await getCategoryByIdFromDB(req.params.id);
    res.render("editCategory", { title: "Edit Category", category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Handle update logic
export const updateCategory = async (req, res) => {
  try {
    await updateCategoryInDB(req.params.id, req.body);
    req.flash("success", "Category updated successfully!");
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update category.");
    res.redirect(`/categories/${req.params.id}/edit`);
  }
};

// Handle delete logic
export const deleteCategory = async (req, res) => {
  try {
    await deleteCategoryFromDB(req.params.id);
    req.flash("success", "Category removed successfully!");
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to remove category.");
    res.redirect("/categories");
  }
};