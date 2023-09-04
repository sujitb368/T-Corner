import ProductModel from "../models/productModel.js";
import RatingModel from "../models/ratingModel.js";

//Api function to store reviews and ratings
const createRatings = async (req, res) => {
  try {
    const { rating, user, productId } = req.body;
    if (!rating || !user || !productId) {
      return res.status(400).send({
        message: "user or rating is not provided",
        success: false,
        error: "Required field missing",
      });
    }
    //find product by productId
    const isProductExist = await RatingModel.findOne({ productId });

    // Check if the user has already rated the product
    const userHasRated = isProductExist.rating.some(
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

export { createRatings };
