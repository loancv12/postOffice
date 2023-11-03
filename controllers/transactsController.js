const mongoose = require("mongoose");

const User = require("../models/User");
const Transact = require("../models/Transact");
const Gather = require("../models/Gather");

// desc get all transacts
// route GET /transacts
// access private
const getAllTransacts = async (req, res) => {
  const transacts = await Transact.find().lean();
  if (!transacts?.length) {
    return res.status(404).json({ message: "Dont have any transact" });
  }

  const transactsWithGatherPoint = await Promise.all(
    transacts.map(async (transact) => {
      const gatherPoint = await Gather.findById(transact.connectToGatherPoint);
      return { ...transact, connectToGatherPoint: gatherPoint.name };
    })
  );

  res.json(transactsWithGatherPoint);
};

// @desc create new transact
// @route POST /transacts
// @access private
const createTransact = async (req, res) => {
  const { name, phone, leader, address, transactArea, connectToGatherPoint } =
    req.body;

  // validate
  // Check all required fields
  if (
    !name ||
    !phone ||
    !leader ||
    !address ||
    !transactArea ||
    !connectToGatherPoint
  ) {
    return res.status(400).json({ message: `All field is required` });
  }

  //   Check have leader'
  const foundLeader = await User.findById(leader).exec();
  if (!foundLeader) {
    return res.status(400).json({ message: "Leader not found" });
  }

  //   Check have gather point
  const gatherPoint = await Gather.findById(connectToGatherPoint).exec();
  if (!gatherPoint) {
    return res
      .status(400)
      .json({ message: "Gather point that transact assign not found" });
  }
  // Check for duplicate name
  const duplicate = await Transact.findOne({ name })
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

  const transactObj = {
    name,
    phone,
    leader,
    address,
    transactArea,
    connectToGatherPoint,
  };
  const result = await Transact.create(transactObj);
  if (result) {
    res.status(201).json({
      message: "Create transact successful",
      transactId: result._id.toString(),
    });
  } else {
    res.status(400).json({ message: "Invalid transact data received" });
  }
};

// @desc Update a transact
// @route PATCH /transacts
// @access Private
const updateTransact = async (req, res) => {
  const {
    id,
    name,
    phone,
    leader,
    address,
    transactArea,
    connectToGatherPoint,
  } = req.body;

  // validate
  // Check all required
  // Check all required
  if (
    !id ||
    !name ||
    !phone ||
    !leader ||
    !address ||
    !transactArea ||
    !connectToGatherPoint
  ) {
    return res.status(400).json({ message: `All field is required` });
  }

  //   Check have transact'
  const transact = await Transact.findById(id).exec();
  if (!transact) {
    return res.status(400).json({ message: "Transact not found" });
  }

  //   Check have leader'
  const foundLeader = await User.findById(leader).exec();
  if (!foundLeader) {
    return res.status(400).json({ message: "Leader not found" });
  }

  //   Check have gather point
  const gatherPoint = await Gather.findById(connectToGatherPoint).exec();
  if (!gatherPoint) {
    return res
      .status(400)
      .json({ message: "Gather point that transact assign not found" });
  }
  // Check for duplicate name
  const duplicate = await Transact.findOne({ name })
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

  transact.name = name;
  transact.phone = phone;
  transact.leader = leader;
  transact.address = address;
  transact.transactArea = transactArea;
  transact.connectToGatherPoint = connectToGatherPoint;

  const updateTransact = await transact.save();
  res.json({ message: `${updateTransact.name} updated` });
};

// @desc Delete a transact
// @route DELETE /transacts
// @access Private
const deleteTransact = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Transact ID required" });
  }

  //   Check have transact
  const transact = await Transact.findById(id).exec();
  if (!transact) {
    return res.status(400).json({ message: "Transact not found" });
  }

  const result = await Transact.deleteOne(transact);
  const reply = `Transact ${transact.name} with ID ${transact._id} deleted`;
  res.json(reply);
};

module.exports = {
  getAllTransacts,
  createTransact,
  updateTransact,
  deleteTransact,
};
