// Import the Category model
import CategoryModel from "../models/categoryModel.js";

// Function to create a new category
const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    // Check if the category field is provided
    if (!category) {
      return res.status(400).send({
        message: "Category must be provided",
        success: false,
        error: "required field not provided",
      });
    }

    // Check if the category already exists
    const isExist = await CategoryModel.findOne({ category });

    if (isExist) {
      return res.status(400).send({
        message: "Category already exist",
        success: true,
      });
    }

    //create a new category
    const createCategory = new CategoryModel({ category });
    //save the category

    // Save the new category to the database
    const savedCategory = await createCategory.save();

    // Return a success response with the created category
    return res.status(201).send({
      message: "category created successfully",
      success: true,
      category: savedCategory,
    });
  } catch (error) {
    // Return a server error response if there's an exception
    console.log("Error in addCategory controller function " + error);
    return res.status(500).send({
      message: "unable to add category ",
      success: false,
      error,
    });
  }
};

// Function to get all categories
const getCategories = async (req, res) => {
  try {
    // Retrieve all categories from the database
    const categories = await CategoryModel.find({});

    // Return a success response with all categories
    return res.status(200).send({
      message: "All categories ",
      success: true,
      categories,
    });
  } catch (error) {
    // Return a server error response if there's an exception
    console.log("Error in addCategory controller function " + error);
    return res.status(500).send({
      message: "unable to add category ",
      success: false,
      error,
    });
  }
};
// Export the createCategory and getCategories functions
export { createCategory, getCategories };
