const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    parcelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    receiver: {
      fullname: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    senderArea: {
      type: String,
      required: true,
    },
    receiveArea: {
      type: String,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      required: true,
      default: "instock",
      enum: {
        values: ["instock", "delivering"],
        message: "{VALUE} is not supported",
      },
    },
    trackLocation: {
      required: true,
      type: [String],
    },
    back: {
      require: true,
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
