import ProductModel from "../models/productModel.js";

//controller function to create a new Product
const createProduct = async (req, res) => {
  try {
    //get all fields of the product
    const { name, description, price, category, quantity, filename } = req.body;
    let { shipping } = req.body;
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

const updateProduct = async (req, res) => {
  try {
    //get all fields of the product
    const { productId } = req.params;
    const { name, description, price, category, quantity, colors, size } =
      req.body;
    let { shipping } = req.body;
    if (shipping === "true") {
      shipping = true;
    } else {
      shipping = false;
    }

    if (!productId) {
      return res.status(400).send({
        message: "product id is required",
        success: false,
        error: "Required field",
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      { _id: productId },
      { name, description, price, category, quantity, colors, size },
      { new: true }
    );
    return res.status(200).send({
      message: "product details updated successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log(`Error updating product ${error}`);
    return res.status(500).send({
      message: "unable to update product",
      success: false,
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
    console.log("stocks available", stock);
    return res.status(200).send({
      message: `only ${stock[0].quantity} stock available`,
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
    //if category is present to filter
    if (category?.length > 0) args.category = category;

    // if price is present to filter for range price[0] to price[1]
    if (price?.length && price[1] !== 0)
      args.price = { $gte: price[0] * 1, $lte: price[1] * 1 };

    //if price is present to filter but only above mention price
    if (price.length && price[1] === 0) args.price = { $gte: price[0] * 1 };

    //filter product

    console.log("args up", args);
    const filterResult = await ProductModel.find({
      $or: [
        {
          category: { $in: args.category },
        },
        {
          price: args.price,
        },
      ],
    })
      .sort({ price: -1 })
      .skip(skip)
      .limit(10);

    return res.status(200).send({
      message: filterResult.length
        ? "Filtered products"
        : "No product found for this filter",
      success: true,
      products: filterResult,
    });
  } catch (error) {
    console.log("error in filter line no. 233", error);
    return res.status().send({
      message: "Internal server error",
      success: false,
      error,
    });
  }
};

export {
  createProduct,
  allProducts,
  productById,
  filterProduct,
  getQuantity,
  updateProduct,
};
