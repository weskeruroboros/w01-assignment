import express from "express";
import categoryRoutes from "./categoryRoutes.js";
import organizationRoutes from "./organizationRoutes.js";
import projectRoutes from "./projectRoutes.js";

const router = express.Router();

// Home Route
router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Mount Module Routes
router.use(categoryRoutes);
router.use(organizationRoutes);
router.use(projectRoutes);

export default router;