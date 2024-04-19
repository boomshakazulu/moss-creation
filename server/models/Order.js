const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  stripePaymentIntentId: {
    type: String,
  },
  address: {
    type: String,
  },
  trackingNum: {
    type: String,
  },
  price: {
    type: Number,
  },
  fulfilled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

(module.exports = Order), { orderSchema };
