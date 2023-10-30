import express from "express";
import {
  upload,
  uploadFileController,
  downloadFile,
  editImageFileController,
} from "../controllers/filesController.js";

const router = express.Router();

// Define a route for file uploads using the controller's upload middleware
router.post("/upload", upload.single("file"), uploadFileController);

router.put(
  "/edit-image/:productId",
  upload.single("file"),
  editImageFileController
);

router.get("/get-file/:filename", downloadFile);
export default router;
