import 'dotenv/config'; 
import express from "express";
import path from "path";
import projectRoutes from "./src/routes/projectRoutes.js";
import organizationRoutes from "./src/routes/organizationRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";

const app = express();

// Configure template rendering engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Serve static elements like style.css from the public folder
app.use(express.static("public"));

/* MAIN DASHBOARD ROUTES */
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

/* REGISTERED MVC ROUTERS */
app.use(projectRoutes);
app.use(organizationRoutes);
app.use(categoryRoutes);

/* GLOBAL 404 ROUTE */
app.use((req, res, next) => {
  // Gracefully falls back to home template if an unrecognized URL is processed
  res.status(404).render("home", { title: "404 - Page Not Found" }); 
});

/* GLOBAL 500 ROUTE */
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR DETECTED:", err.stack);
  res.status(500).send("<h3>Internal Server Error (500)</h3><p>Check console logs for details.</p>");
});

// Start the framework engine locally
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
});