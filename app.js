const express = require("express");
var app = express();
var multer = require("multer");
var PORT = 3000 || process.env.PORT;
var fs = require("fs");
var sharp = require("sharp");
var inputFileName;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1000000 },
  storage: storage,
}).array("file",10);

app.get("/", function (req, res) {
  res.send("Server is live.");
});

app.post("/uploadimage", function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send("Something went wrong!");
    }
    inputFileName = req.file.path;

    sharp(inputFileName)
      .resize({ width: 500, height: 450 })
      .toFormat("png")
      .png({ quality: 100 })
      .toFile("uploads/resized.png")
  });

  res.send("File Saved And Resized Successfully.");

});

app.listen(PORT, () => {
  console.log("Server is litening on " + PORT);
});
