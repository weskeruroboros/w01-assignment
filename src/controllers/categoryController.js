import { getAllCategories, getCategoryById, getProjectsByCategory } from "../models/categories.js";

// Display all categories
export async function getCategories(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.render("categories", { title: "Service Project Categories", categories });
  } catch (error) { 
    next(error); 
  }
}

// Display details for a single category
export async function getCategoryDetails(req, res, next) {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    
    if (!category) {
      const err = new Error("Category Not Found");
      err.status = 404;
      return next(err);
    }
    
    const projects = await getProjectsByCategory(categoryId);
    res.render("categoryDetails", { title: category.name, category, projects });
  } catch (error) { 
    next(error); 
  }
}