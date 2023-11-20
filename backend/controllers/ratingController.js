// Import necessary models for order, product, and rating management

import MyOrderModel from "../models/myOrderModel.js";
import ProductModel from "../models/productModel.js";
import RatingModel from "../models/ratingModel.js";

//Api function to store reviews and ratings
const createRatings = async (req, res) => {
  try {
    // Destructure rating, user, and productId from the request body
    const { rating, user, productId } = req.body;

    // Check if required fields are provided
    if (!rating || !user || !productId) {
      return res.status(400).send({
        message: "user or rating is not provided",
        success: false,
        error: "Required field missing",
      });
    }
    // Call myRating function to update the user's order with the given rating
    await myRating(rating, user, productId, res);
    //find product by productId
    const isProductExist = await RatingModel.findOne({ productId });

    // Check if the user has already rated the product
    const userHasRated = isProductExist?.rating.some(
      (rating) => rating.user.toString() === user
    );

    if (userHasRated) {
      return res.status(400).send({
        message: "User has already rated the product",
        success: false,
      });
    }

    //variable to calculate average rating
    let newAvgRating;
    //if product is exist then calculate average rating
    if (isProductExist) {
      // Calculate the new average rating
      newAvgRating =
        (isProductExist.totalRating + rating) /
        (isProductExist.countOfUser + 1);

      // Update the document with the new rating and averageRating
      isProductExist.rating.push({ user: user, rating });
      //update totalRating
      isProductExist.totalRating += rating;
      //update averageRating with newAvgRating after calculating
      isProductExist.averageRating = newAvgRating;
      //update count of users who have rated this product
      isProductExist.countOfUser += 1;
      // Save the updated document
      const findProduct = await ProductModel.findOne({ _id: productId });
      if (!findProduct) {
        return res.status(404).send({
          message: "Invalid Product id",
          success: false,
        });
      }
      findProduct.averageRating = newAvgRating;
      findProduct.save();
      await isProductExist.save();
      return res.status(201).send({
        message: "rating has been saved successfully",
        success: true,
        rating: isProductExist,
      });
    } else {
      // If there are no existing ratings, create a new document
      const newRating = new RatingModel({
        productId: productId,
        rating: [{ rating, user }],
        averageRating: rating, // Since this is the first rating, it's the average
        countOfUser: 1, // Initialize ratingcount to 1 for the first rating
        totalRating: rating,
      });

      // Save the new document
      await newRating.save();

      return res.status(201).send({
        message: "rating has been saved successfully",
        success: true,
        rating: newRating,
      });
    }
  } catch (error) {
    console.log("Error while creating ratings", error);
    return res.status(500).send({
      message: "unable to submit rating ",
      success: false,
      error: error.message,
    });
  }
};

/**
 * Function to update the user's order with the given rating.
 * @param {number} rating - The rating to be updated.
 * @param {string} user - The user ID.
 * @param {string} productId - The product ID.
 */
const myRating = async (rating, user, productId) => {
  try {
    const myOrders = await MyOrderModel.findOne({ user });

    if (myOrders) {
      const filter = { user };
      const update = {
        $set: {
          "orders.$[order].orderItems.$[item].myRating": rating,
        },
      };
      const options = {
        arrayFilters: [
          { "order.orderItems.productId": productId },
          { "item.productId": productId },
        ],
        new: true,
      };

      const updatedOrder = await MyOrderModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      if (updatedOrder) {
        console.log("Updated order with new rating", updatedOrder);
      } else {
        console.log("Product not found in the order");
      }
    } else {
      console.log("User not found in orders");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

// Export the function for use in routes
export { createRatings };
