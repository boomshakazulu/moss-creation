const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
  },
  video: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
