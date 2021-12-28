const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//connect to DB

mongoose.connect("mongodb://localhost/pcat-test-db");

//create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model("Photo", PhotoSchema);

//create a photo
Photo.create({
  title: "Photo title 1",
  description: "Photo description 1",
});

Photo.create({
  title: "Photo title 2",
  description: "Photo description 2",
});
