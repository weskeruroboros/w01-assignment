import express from "express";
import { body } from "express-validator";
import { 
  getCategories, 
  getCategoryDetails, 
  getNewCategoryForm, 
  createCategory, 
  getEditCategoryForm, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";

const router = express.Router();

// Validation middleware for categories
const validateCategoryInput = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long")
];

// Specific routes must come BEFORE dynamic routes (like /:id)
router.get("/new-category", getNewCategoryForm);
router.get("/categories/new", getNewCategoryForm);

router.get("/categories", getCategories);
router.post("/categories", validateCategoryInput, createCategory);

// Category Details route (Required by rubric)
router.get("/categories/:id", getCategoryDetails);

router.get("/categories/:id/edit", getEditCategoryForm);
router.post("/categories/:id/edit", validateCategoryInput, updateCategory);
router.post("/categories/:id/delete", deleteCategory);

export default router;