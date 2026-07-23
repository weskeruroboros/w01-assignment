import { validationResult } from "express-validator";
import { 
  getCategoriesFromDB, 
  createCategoryInDB, 
  getCategoryByIdFromDB, 
  updateCategoryInDB, 
  deleteCategoryFromDB,
  getAllProjectsWithSelection,
  updateCategoryProjects,
  getAllProjectsForNewCategory
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

// Render category details page (Required by rubric)
export const getCategoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryByIdFromDB(categoryId);
    
    if (!category) {
      req.flash("error", "Category not found.");
      return res.redirect("/categories");
    }

    const projects = await getAllProjectsWithSelection(categoryId);

    res.render("categoryDetails", { title: "Category Details", category, projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Render the form to create a new category
export const getNewCategoryForm = async (req, res) => {
  try {
    const projects = await getAllProjectsForNewCategory();
    res.render("newCategory", { title: "Add New Category", projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Handle creation logic with express-validator integration
export const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const projects = await getAllProjectsForNewCategory();
      return res.status(400).render("newCategory", { 
        title: "Add New Category", 
        errors: errors.array(), 
        oldData: req.body,
        projects 
      });
    } catch (renderErr) {
      console.error(renderErr);
      return res.status(500).send("Server Error");
    }
  }

  try {
    const { name, projects } = req.body;
    const newCategory = await createCategoryInDB(name);
    
    if (newCategory && newCategory.category_id) {
      await updateCategoryProjects(newCategory.category_id, projects);
    }

    req.flash("success", "Category created successfully!");
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create category.");
    res.redirect("/categories/new");
  }
};

// Render the edit form
export const getEditCategoryForm = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryByIdFromDB(categoryId);
    
    if (!category) {
      req.flash("error", "Category not found.");
      return res.redirect("/categories");
    }

    const projects = await getAllProjectsWithSelection(categoryId);

    res.render("editCategory", { title: "Edit Category", category, projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Handle update logic with express-validator integration
export const updateCategory = async (req, res) => {
  const errors = validationResult(req);
  const categoryId = req.params.id;

  if (!errors.isEmpty()) {
    try {
      const category = await getCategoryByIdFromDB(categoryId);
      const projects = await getAllProjectsWithSelection(categoryId);
      return res.status(400).render("editCategory", { 
        title: "Edit Category", 
        errors: errors.array(), 
        category: { ...category, ...req.body },
        projects 
      });
    } catch (renderErr) {
      console.error(renderErr);
      return res.status(500).send("Server Error");
    }
  }

  try {
    const { name, projects } = req.body;

    await updateCategoryInDB(categoryId, name);
    await updateCategoryProjects(categoryId, projects);

    req.flash("success", "Category updated successfully!");
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update category.");
    res.redirect(`/categories/${categoryId}/edit`);
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