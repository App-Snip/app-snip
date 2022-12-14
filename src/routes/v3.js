"use strict";

const express = require("express");
const dataModules = require("../models");

const can = require("../auth/middleware/acl");

const router = express.Router();

const { uploadToCloudinaryMiddleware } = require("../lib/upload");

const multer = require("multer");

// Use memory for img storage...
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: storage });
// Use tmp dir for img storage...
//const TEMP_UPLOAD_DIR = process.env.TEMP_UPLOAD_DIR;
//const uploadMiddleware = multer({ dest: TEMP_UPLOAD_DIR });

router.param("model", (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next("Invalid Model");
  }
});

async function handleGetStudentImages(req, res) {
  const student_username = req.params.student_username;
  res.json([{ title: "Image 1", imgUrl: "https://placeholder/img.jpg" }]);
}

router.get("/:model", can("read_all"), handleGetAll);
router.get(
  "/images-for-student/:student_username",
  can("read_all"),
  handleGetStudentImages
);
// router.get("/:model/:id", can("read_own"), handleGetOne);
router.post(
  "/:model",
  can("create_own"),
  uploadMiddleware.single("screenshot_img"),
  uploadToCloudinaryMiddleware,
  handleCreate
);
//router.put("/:model/:id", can("edit"), handleUpdate);
//router.delete("/:model/:id", can("delete"), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  if (req.uploadedImg) {
    obj.imgUrl = req.uploadedImg.imgUrl;
  }
  obj.creatorId = req.user.id;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

module.exports = router;
