import CartModel from "../models/cartModel.js"; // import cart models
import UserModel from "../models/userModel.js"; // import userModel from '../models/user
import ProductModel from "../models/productModel.js"; // Import the Product model

// POST route to add a product to the user's cart
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params; // Get the user ID from the route parameter

    // Assuming you get the product ID and quantity from the request body
    const { cartItems } = req.body;

    // Check if the user exists
    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Find the product by ID (You should implement this logic based on your Product model)
    //   const product = await Product.findById(productId);

    //   if (!product) {
    //     return res.status(404).json({ message: 'Product not found' });
    //   }

    // Check if the product is already in the user's cart
    //   const cartItem = await CartItem.findOneAndUpdate(
    //     { user: userId, product: productId },
    //     { $inc: { quantity } }, // Increment the quantity if the product is already in the cart
    //     { new: true } // Return the updated cart item
    //   );
    let cartItem = await CartModel.findOneAndUpdate(
      { user: userId },
      { cartItems },
      // { $inc: { quantity } }, // Increment the quantity if the product is already in the cart
      { new: true } // Return the updated cart item
    );

    if (!cartItem) {
      // If the product is not in the cart, create a new cart item
      cartItem = new CartModel({
        user: userId,
        cartItems,
      });

      await cartItem.save();
    }

    return res.status(201).send({
      message: "Added to cart",
      success: true,
      cartItem,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    const cartItem = await CartModel.findOneAndUpdate(
      { user: userId },
      { cartItems }
    );

    return res.status(200).send({
      message: "Item deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Unable to delete from cart", success: false, error });
  }
};

export { addToCart, deleteFromCart };
