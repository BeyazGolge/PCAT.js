const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const Photo = require("./models/Photo");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const methodOverride = require("method-override", {
  methods: ["POST", "GET"],
});
const photoController = require("./controllers/photoControllers");
const pageController = require("./controllers/pageController");

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
app.use(fileUpload());
app.use(methodOverride("_method"));
// app.use(myLogger);

app.get("/", photoController.getAllPhotos);
app.get("/about", pageController.getAboutPage);
app.get("/photos/:id", photoController.getPhoto);
app.get("/add_photo", pageController.getAddPage);
app.post("/photos", photoController.createPhoto);

app.get("/photos/edit/:id", pageController.getEditPage);

app.put("/photos/:id", photoController.updatePhoto);

app.delete("/photos/:id", photoController.deletePhoto);

app.listen(port, () => {
  console.log("Server is live");
});
