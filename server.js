import express from "express";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const getHome = (req, res) => {
  res.render("home", { title: "Home" });
};

const getOrganizations = (req, res) => {
  res.render("organizations", { title: "Organizations" });
};

const getProjects = (req, res) => {
  res.render("projects", { title: "Service Projects" });
};

const getCategories = (req, res) => {
  res.render("categories", { title: "Service Project Categories" });
};

app.get("/", getHome);
app.get("/organizations", getOrganizations);
app.get("/projects", getProjects);
app.get("/categories", getCategories);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});