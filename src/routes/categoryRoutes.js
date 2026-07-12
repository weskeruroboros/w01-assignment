import express from "express";
import { getCategories, getCategoryDetails } from "../controllers/categoryController.js";

const router = express.Router();

// Route for the main categories list page
router.get("/categories", getCategories);

// Route for a single category details page (e.g., /category/1)
router.get("/category/:id", getCategoryDetails);

export default router;