const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    parcelName: {
      type: String,
      required: true,
    },
    parcelPrice: {
      type: Number,
      required: true,
    },
    parcelType: {
      type: String,
      required: true,
      enum: ["document", "good"],
    },
    parcelNote: {
      type: String,
    },
    totalWeight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Parcel", parcelSchema);
