const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const User = require("../models/User");
const Note = require("../models/Order");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // The lean option tells Mongoose to skip hydrating the result documents.
  //   result documents are plain old JavaScript objects (POJOs), not Mongoose documents
  //   If you're executing a query and sending the results without modification
  //   if you do not modify the query results and do not use custom getters,

  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No user found" });
  }
  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;
  // Confirm data
  if (!username || !password) {
    return res.status(400).json({ message: "All field are required" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({ username })
    .collation({
      // The ICU locale
      locale: "en",
      // The level of comparison to perform: 2: thuc hien so sanh chu ki tu va dau phu, ko tinh case hoa, thuong
      strength: 2,
    })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash the pass
  const saltRounds = 10;
  const hashedPwd = await bcrypt.hash(password, saltRounds);

  const userObj =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPwd }
      : { username, password: hashedPwd, roles };

  // Create and Store new user
  const user = await User.create(userObj);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All field are requierd" });
  }

  //   Find user
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //   Check for duplicate
  const duplicate = await User.findOne({ username })
    .collation({
      // The ICU locale
      locale: "en",
      // The level of comparison to perform: 2: thuc hien so sanh chu ki tu va dau phu, ko tinh case hoa, thuong
      strength: 2,
    })
    .lean()
    .exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    // Hash password
    const saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);
  }

  const updateUser = await user.save();

  res.json({ message: `${updateUser.username} updated` });
};

// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID requiered" });
  }

  // Check ID is valid
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: "User ID invalid" });
  }

  // Does the user still have assigned notes?
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assign notes" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();
  console.log("user", user);
  if (!user) {
    console.log("not found");
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
