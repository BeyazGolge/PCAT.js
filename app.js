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

app.get("/", async (req, res) => {
  const photos = await Photo.find().sort("-dateCreated");
  res.render("index", {
    photos: photos,
  });
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/photos/:id", async (req, res) => {
  //res.render("about");
  console.log(req.params.id);
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo: photo,
  });
});
app.get("/add_photo", (req, res) => {
  res.render("add_photo");
});
app.post("/photos", async (req, res) => {
  // await Photo.create(req.body);
  // res.redirect("/");
  // console.log("post");

  const uploadDir = "public/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadedImage.name;
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
});

app.get("/photos/edit/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("edit", {
    photo: photo,
  });
});

app.put("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
});

app.delete("/photos/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  let deletedImage = __dirname + "/public" + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server is live");
});
