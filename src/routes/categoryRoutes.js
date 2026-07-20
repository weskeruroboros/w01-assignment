import express from "express";
import { 
  getCategories, 
  getNewCategoryForm, 
  createCategory, 
  getEditCategoryForm, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";

const router = express.Router();

// Specific routes must come BEFORE dynamic routes (like /categories/:id)
router.get("/new-category", getNewCategoryForm);
router.get("/categories/new", getNewCategoryForm);

router.get("/categories", getCategories);
router.post("/categories", createCategory);

router.get("/categories/:id/edit", getEditCategoryForm);
router.post("/categories/:id", updateCategory);
router.post("/categories/:id/delete", deleteCategory);

export default router;