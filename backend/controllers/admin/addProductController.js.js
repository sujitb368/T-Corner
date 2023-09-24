import ProductModel from "../../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).send({
        message: "All fields are required",
        success: false,
        error: "missing fields",
      });
    }

    const product = new ProductModel({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      image,
    });
  } catch (error) {
    console.log(`error in addProduct ${error}`);
  }
};

export { addProduct };
