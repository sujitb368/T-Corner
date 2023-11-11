import CategoryModel from "../models/categoryModel.js";

const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).send({
        message: "Category must be provided",
        success: false,
        error: "required field not provided",
      });
    }

    const isExist = await CategoryModel.findOne({ category });

    console.log("isExist category", isExist);

    if (isExist) {
      return res.status(400).send({
        message: "Category already exist",
        success: true,
      });
    } //create a new category
    const createCategory = new CategoryModel({ category });
    //save the category
    const savedCategory = await createCategory.save();
    return res.status(201).send({
      message: "category created successfully",
      success: true,
      category: savedCategory,
    });
  } catch (error) {
    console.log("Error in addCategory controller function " + error);
    return res.status(500).send({
      message: "unable to add category ",
      success: false,
      error,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});

    return res.status(200).send({
      message: "All categories ",
      success: true,
      categories,
    });
  } catch (error) {
    console.log("Error in addCategory controller function " + error);
    return res.status(500).send({
      message: "unable to add category ",
      success: false,
      error,
    });
  }
};

export { createCategory, getCategories };
