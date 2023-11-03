const mongoose = require("mongoose");

const transactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    transactArea: {
      type: String,
      required: true,
    },
    connectToGatherPoint: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Gather",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transact", transactSchema);
