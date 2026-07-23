import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";

// Import Central Router
import indexRouter from "./src/routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Request Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serves static files (CSS, Images, Client JS) from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Session & Flash Setup
app.use(
  session({
    secret: "your_secret_key_here",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Pass Flash Messages to All EJS Templates Automatically
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Mount Central Router
app.use(indexRouter);

// Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});