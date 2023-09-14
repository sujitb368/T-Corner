import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productModel", // Reference to the User model
    required: true,
  },
  rating: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel", // Reference to the User model
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
      },
    },
  ],
  totalRating: { type: Number, required: true },
  averageRating: { type: Number, required: true },
  countOfUser: { type: Number, required: true },
});
const RatingModel = mongoose.model("RatingModel", ratingSchema);
export default RatingModel;
