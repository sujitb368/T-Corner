// Import necessary modules and controllers for file handling
import express from "express";
import {
  upload,
  uploadFileController,
  downloadFile,
  editImageFileController,
  editProfileImageFileController,
} from "../controllers/filesController.js";

// Create an Express router
const router = express.Router();

// Define a route for file uploads using the controller's upload middleware
router.post("/upload", upload.single("file"), uploadFileController);

// Route for editing an image file associated with a product
router.put(
  "/edit-image/:productId",
  upload.single("file"),
  editImageFileController
);

// Route for editing a profile image associated with a user
router.put(
  "/profile-image/:userId",
  upload.single("file"),
  editProfileImageFileController
);

// Route for downloading a file by filename
router.get("/get-file/:filename", downloadFile);

// Export the router for use in other parts of the application
export default router;
