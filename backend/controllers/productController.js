import ProductModel from "../models/productModel.js";

//controller function to create a new Product
const createProduct = async (req, res) => {
  try {
    //get all fields of the product
    const { name, description, price, category, quantity, filename } = req.body;
    let { shipping } = req.body;
    console.log("filename", filename);
    if (shipping === "true") {
      shipping = true;
    } else {
      shipping = false;
    }

    //validation
    switch (true) {
      case !name:
        return res.status(400).send({
          success: false,
          message: "Required field",
          error: "Name is Required",
        });
      case !description:
        return res.status(400).send({
          success: false,
          message: "Required field",
          error: "Description is Required",
        });
      case !price:
        return res.status(400).send({
          success: false,
          message: "Required field",
          error: "Price is Required",
        });
      case !category:
        return res.status(400).send({
          success: false,
          message: "Required field",
          error: "Category is Required",
        });
      case !quantity:
        return res.status(400).send({
          success: false,
          message: "Required field",
          error: "Quantity is Required",
        });
    }

    //create product
    const product = new ProductModel({
      name,
      description,
      quantity,
      price,
      category,
      shipping,
      image: filename,
    });

    //save product to db
    const savedProduct = await product.save();
    return res.status(201).send({
      message: "product create successfully",
      success: true,
      product: savedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "unable to create product ",
      success: false,
      error,
    });
  }
};

//get all products
const allProducts = async (req, res) => {
  console.log("Product called");
  try {
    //get page number
    const { page } = req.params ?? 0;
    const skip = page * 10;

    //find all products then sort with latest first
    const products = await ProductModel.find({});
    // .sort({ createdAt: -1 })
    // .skip(skip)
    // .limit(10);
    //send response to client
    return res.status(200).send({
      message: "All products",
      success: true,
      products,
    });
  } catch (error) {
    console.log("error in getAllProducts", error);
    return res.status(500).send({
      message: "unable to get products ",
      success: false,
      error,
    });
  }
};
//get all products
const productById = async (req, res) => {
  try {
    //get page number
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).send({
        message: "unable to get products",
        success: false,
        error: "Product id not provided",
      });
    }

    //find all products then sort with latest first
    const product = await ProductModel.find({ _id: productId });

    //send response to client
    return res.status(200).send({
      message: "product details found",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).send({
      message: "unable to get products ",
      success: false,
      error,
    });
  }
};

//get all products
const deleteProduct = async (req, res) => {
  try {
    //get page number
    const { productId } = req.params;

    if (!productId) {
      return res.status(404).send({
        message: "unable to get products",
        success: false,
        error: "Product id not provided",
      });
    }

    const product = await ProductModel.find({ _id: productId });

    //send response to client
    return res.status(200).send({
      message: "product details found",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).send({
      message: "unable to get products ",
      success: false,
      error,
    });
  }
};

// get stock
const getQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    //get the available quantity of the product
    const stock = await ProductModel.find({ _id: productId });
    if (stock[0].quantity > quantity) {
      return res.status(200).send({
        message: "stock available",
        success: true,
        quantity: stock[0].quantity,
      });
    }
    return res.status(200).send({
      message: `only ${stock.quantity} stock available`,
      success: false,
      quantity: stock.quantity,
    });
  } catch (error) {
    console.log(`error while getting stock`, error);

    return res.status(500).send({
      message: "Internal server error ",
      success: false,
      error,
    });
  }
};

/* 
APIs for filter and search
 */

const filterProduct = async (req, res) => {
  try {
    const { price, category } = req.body;

    const { page } = req.params ?? 0;
    const skip = page * 10;

    let args = {};
    if (category.length > 0) args.category = category;
    if (price.length) args.price = { $lte: price };
    const products = await ProductModel.find(args)
      .sort({ price: -1 })
      .skip(skip)
      .limit(10);

    return res.status(200).send({
      message: "Filtered products",
      success: true,
      product: filterResult,
    });
  } catch (error) {
    return res.status().send({
      message: "Internal server error",
      success: false,
      error,
    });
  }
};

export { createProduct, allProducts, productById, filterProduct, getQuantity };
