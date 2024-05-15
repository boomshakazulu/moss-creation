const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
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

module.exports = { Order, orderSchema };
