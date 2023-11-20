// Import cart models
import CartModel from "../models/cartModel.js"; // import cart models
// Import userModel from '../models/user'
import UserModel from "../models/userModel.js"; // import userModel from '../models/user

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
    // Find and update the user's cart with the new cart items
    let cartItem = await CartModel.findOneAndUpdate(
      { user: userId },
      { cartItems },
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

// Route to delete a product from the user's cart
const deleteFromCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    // Find and update the user's cart with the updated cart items
    const cartItem = await CartModel.findOneAndUpdate(
      { user: userId },
      { cartItems }
    );

    // Return a success response if the item is deleted from the cart
    return res.status(200).send({
      message: "Item deleted",
      success: true,
    });
  } catch (error) {
    // Return an error response if there's an exception during deletion
    console.log(error);
    return res
      .status(500)
      .send({ message: "Unable to delete from cart", success: false, error });
  }
};

export { addToCart, deleteFromCart };
