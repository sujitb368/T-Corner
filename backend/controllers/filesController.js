import multer from "multer";
// import { relativeDirname } from "../config.js";

import { __dirname } from "../config.js";
import ProductModel from "../models/productModel.js";

// Define storage settings for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where uploaded files will be stored
    cb(null, "uploadedFiles/");
  },
  filename: function (req, file, cb) {
    // Set the file name for the uploaded file
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// Create a Multer instance with the storage and size limits settings
const upload = multer({
  storage: storage,
  limit: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        JSON.stringify({
          message:
            "only file type allowed are image/png, image/jpg, image/jpeg",
          success: false,
          error: "file type not allowed",
        })
      );
    }
  },
});

//function to handle file upload
const uploadFileController = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        message: "No file uploaded",
        success: false,
      });
    }

    // Access the file details through req.file
    const uploadedFile = req.file;

    return res.status(201).send({
      message: "File uploaded",
      success: true,
      filename: uploadedFile.filename,
    });
  } catch (error) {
    console.log(`Error in uploadFile ${error}`);
    return res.status({
      message: "Internal server error",
      success: false,
      error,
    });
  }
};

//function to handle file upload for image editing
const editImageFileController = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!req.file) {
      return res.status(400).send({
        message: "No file uploaded",
        success: false,
      });
    }

    // Access the file details through req.file
    const uploadedFile = req.file;

    const product = await ProductModel.findByIdAndUpdate(
      { _id: productId },
      { image: uploadedFile.filename },
      { new: true }
    );

    return res.status(201).send({
      message: "File uploaded",
      success: true,
      product,
    });
  } catch (error) {
    console.log(`Error in uploadFile ${error}`);
    return res.status({
      message: "Internal server error",
      success: false,
      error,
    });
  }
};

const downloadFile = (req, res) => {
  const fileName = req.params.filename;
  const path = __dirname + "/uploadedFiles/";

  res.download(path + fileName, (error) => {
    console.log(path + fileName);
    if (error) {
      res.status(500).send({
        success: false,
        message: "File cannot be downloaded " + error,
      });
    }
  });
};
export { upload, uploadFileController, downloadFile, editImageFileController };
