const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const Photo = require("./models/Photo");

//Connect DB
mongoose.connect("mongodb://localhost/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//TEMPLATE ENGINE
app.set("view engine", "ejs");

// const myLogger = (req, res, next) => {
//   console.log("Middleware Log 1");
//   next();
// };

//MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(myLogger);

app.get("/", async (req, res) => {
  const photos = await Photo.find();
  res.render("index", {
    photos: photos,
  });
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/add_photo", (req, res) => {
  res.render("add_photo");
});
app.post("/photos", async (req, res) => {
  await Photo.create(req.body);
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server is live");
});
