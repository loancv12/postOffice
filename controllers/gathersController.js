const mongoose = require("mongoose");

const User = require("../models/User");
const Gather = require("../models/Gather");
const validate = require("../utils/validate");

// desc get all gathers
// route GET /gathers
// access private
const getAllGathers = async (req, res) => {
  const gathers = await Gather.find().lean();
  if (!gathers?.length) {
    return res.status(404).json({ message: "Dont have any gather" });
  }

  res.json(gathers);
};

// @desc create new gather
// @route POST /gathers
// @access private
const createGather = async (req, res) => {
  const { name, phone, leader, address } = req.body;

  // validate
  // Check all required
  if (!name || !phone || !leader || !address) {
    return res.status(400).json({ message: `All field is required` });
  }
  //   Check have leader'
  const foundLeader = await User.findById(leader).exec();
  if (!foundLeader) {
    return res.status(400).json({ message: "Leader not found" });
  }
  // Check for duplicate name
  const duplicate = await Gather.findOne({ name })
    .collation({
      // The ICU locale
      locale: "en",
      // The level of comparison to perform: 2: thuc hien so sanh chu ki tu va dau phu, ko tinh case hoa, thuong
      strength: 2,
    })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate name" });
  }

  const gatherObj = {
    name,
    phone,
    leader,
    address,
    gatherArea,
  };
  const result = await Gather.create(gatherObj);
  if (result) {
    res.status(201).json({
      message: "Create gather successful",
      gatherId: result._id.toString(),
    });
  } else {
    res.status(400).json({ message: "Invalid gather data received" });
  }
};

// @desc Update a gather
// @route PATCH /gathers
// @access Private
const updateGather = async (req, res) => {
  const { id, name, phone, leader, address } = req.body;

  // validate
  // Check all required
  if (!name || !phone || !leader || !address) {
    return res.status(400).json({ message: `All field is required` });
  }

  //   Check have leader'
  const foundLeader = await User.findById(leader).exec();
  if (!foundLeader) {
    return res.status(400).json({ message: "Leader not found" });
  }

  //   Check have gather point
  const gather = await Gather.findById(id).exec();
  if (!gather) {
    return res
      .status(400)
      .json({ message: "Gather point that transact assign not found" });
  }

  //   Check for duplicate
  const duplicate = await Gather.findOne({ name })
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
    return res.status(409).json({ message: "Duplicate name" });
  }

  gather.name = name;
  gather.phone = phone;
  gather.leader = leader;
  gather.address = address;

  const updateGather = await gather.save();
  res.json({ message: `Gather ${updateGather.name} updated` });
};

// @desc Delete a gather
// @route DELETE /gathers
// @access Private
const deleteGather = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Gather ID required" });
  }

  //   Check have gather
  const gather = await Gather.findById(id).exec();
  if (!gather) {
    return res.status(400).json({ message: "Gather not found" });
  }

  const result = await Gather.deleteOne(gather);
  const reply = `Gather ${gather.name} with ID ${gather._id} deleted`;
  res.json(reply);
};

module.exports = {
  getAllGathers,
  createGather,
  updateGather,
  deleteGather,
};
