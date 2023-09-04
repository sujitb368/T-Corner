import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
});

const CategoryModel = mongoose.model("CategoryModel", categorySchema);

export default CategoryModel;
