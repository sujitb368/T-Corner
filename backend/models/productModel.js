import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
    },
    shipping: {
      type: Boolean,
    },
    colors: {
      type: [String],
      required: true,
    },
    size: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("ProductModel", ProductSchema);

export default ProductModel;
