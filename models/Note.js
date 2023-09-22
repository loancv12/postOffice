const mongoose = require("mongoose");
const { AutoIncrementID } = require("@typegoose/auto-increment");
// console.log(typeof obj.AutoIncrementID);
// import { AutoIncrementID } from "@typegoose/auto-increment";

const noteSchema = new mongoose.Schema(
  {
    ticket: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
noteSchema.plugin(AutoIncrementID, { field: "ticket" });

module.exports = mongoose.model("Note", noteSchema);
