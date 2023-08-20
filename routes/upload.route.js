const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/upload.controller");
const { getStorePath } = require("../utils/helper.util");

const router = express.Router();

//middle ware for storing the data
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = getStorePath(file);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    console.log("multer file :> ", file);
    cb(null, Date.now() + "-" + file.originalname);
    console.log("file is written");
  },
});

const upload = multer({ storage: storage });
// const upload = multer(); //used for sending buffer or stream data

router.get("/", uploadController.get);

router.post("/", upload.single("MyFile"), uploadController.create);

module.exports = router;
