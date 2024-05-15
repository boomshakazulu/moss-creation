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
  carrier: {
    type: String,
  },
  price: {
    type: Number,
  },
  fulfilled: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
  },
  customerName: {
    type: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

(module.exports = Order), { orderSchema };
