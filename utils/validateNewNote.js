const mongoose = require("mongoose");

const User = require("../models/User");
const Note = require("../models/Note");

/*

//   Confirm data
  if (!userId || !title || !text) {
    return res.status(400).json({ message: "All field are required" });
  }

  //   Check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Title" });
  }

  //Check have user that note will be assigned
  const user = await User.findById(userId).lean().exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `Don't have user with id ${userId} ` });
  }

*/

const validateNewNote = async (note) => {
  console.log("validateNewNote", note);
  const { user: userId, title, text } = note;
  let errmsg;

  //   Confirm data
  if (!userId || !title || !text) {
    errmsg = {
      status: 400,
      message: { message: "All field are required" },
    };
  }

  //   Check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    errmsg = {
      status: 409,
      message: { message: "Duplicate Title" },
    };
  }

  //Check have user that note will be assigned
  const user = await User.findById(userId).lean().exec();
  if (!user) {
    errmsg = {
      status: 400,
      message: { message: `Don't have user with id ${userId} ` },
    };
  }
  console.log("errmsg", errmsg);
  return errmsg;
};

module.exports = validateNewNote;
