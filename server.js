import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";

// Import your routes
import categoryRoutes from "./src/routes/categoryRoutes.js";
import organizationRoutes from "./src/routes/organizationRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CRITICAL: Serves static files (images, css, js) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Session & Flash messaging setup
app.use(
  session({
    secret: "your_secret_key_here",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Global variables for flash messages and views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Mount Routes
app.use(categoryRoutes);
app.use(organizationRoutes);
app.use(projectRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});