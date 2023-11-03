const mongoose = require("mongoose");

const User = require("../models/User");

/*


*/

const validate = (dataArr, rule) => {
  let status;
  let errmsg;
  switch (rule) {
    case "allRequired":
      const missIndex = dataArr.findIndex((field) => !field);
      if (missIndex !== -1) {
        status = 400;
        errmsg = `All field is required`;
      }
      break;
    case "duplicate":

    default:
      break;
  }
  console.log("validate", status, errmsg);
  return { status, errmsg };
};

const validateNewNote = async (note) => {
  console.log("validateNewNote", note);
  let errmsg;
  const { user: userId, title, text } = note;

  //   Confirm data
  if (!userId || !title || !text) {
    return {
      status: 400,
      message: "All field are required",
    };
  }

  //   Check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    return {
      status: 409,
      message: "Duplicate Title",
    };
  }

  //Check have user that note will be assigned
  const user = await User.findById(userId).lean().exec();
  if (!user) {
    return {
      status: 400,
      message: `Don't have user with id ${userId} `,
    };
  }

  return errmsg;
};

module.exports = validate;
