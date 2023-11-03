const mongoose = require("mongoose");

const Parcel = require("../models/Parcel");
const validate = require("../utils/validate");

// desc get all parcels
// route GET /parcels
// access private
const getAllParcels = async (req, res) => {
  const parcels = await Parcel.find().lean();
  if (!parcels?.length) {
    return res.status(404).json({ message: "Dont have any parcel" });
  }

  res.json(parcels);
};

// @desc create new parcel
// @route POST /parcels
// @access private
const createParcel = async (req, res) => {
  const { parcelName, parcelPrice, parcelType, parcelNote, totalWeight } =
    req.body;

  // validate
  // Check all required
  if (!parcelName || !parcelPrice || !parcelType || !totalWeight) {
    return res.status(400).json({ message: `All field is required` });
  }
  // Check type of parcel
  const typeofParcel = ["document", "good"];
  if (!typeofParcel.includes(parcelType)) {
    console.log("12");
    return res
      .status(400)
      .json({ message: `Parcel must be one of these type: document, good` });
  }

  let parcelObj = {
    parcelName,
    parcelPrice,
    parcelType,
    totalWeight,
  };
  if (parcelNote) {
    parcelObj = {
      ...parcelObj,
      parcelNote,
    };
  }
  const result = await Parcel.create(parcelObj);
  if (result) {
    res.status(201).json({
      message: "Create parcel successful",
      parcelId: result._id.toString(),
    });
  } else {
    res.status(400).json({ message: "Invalid parcel data received" });
  }
};

// @desc Update a parcel
// @route PATCH /parcels
// @access Private
const updateParcel = async (req, res) => {
  const { id, parcelName, parcelPrice, parcelType, parcelNote, totalWeight } =
    req.body;

  // validate
  // Check all required
  if (!id || !parcelName || !parcelPrice || !parcelType || !totalWeight) {
    return res.status(400).json({ message: `All field is required` });
  }
  // Check type of parcel
  const typeofParcel = ["document", "good"];
  if (!typeofParcel.includes(parcelType)) {
    return res
      .status(400)
      .json({ message: `Parcel must be one of these type: document, good` });
  }
  //   Check have parcel'
  const parcel = await Parcel.findById(id).exec();
  if (!parcel) {
    return res.status(400).json({ message: "Leader not found" });
  }

  parcel.parcelName = parcelName;
  parcel.parcelPrice = parcelPrice;
  parcel.parcelType = parcelType;
  if (parcelNote) {
    parcel.parcelNote = parcelNote;
  }
  parcel.totalWeight = totalWeight;

  const updateParcel = await parcel.save();
  res.json({ message: `${updateParcel.parcelName} updated` });
};

// @desc Delete a parcel
// @route DELETE /parcels
// @access Private
const deleteParcel = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Parcel ID required" });
  }

  //   Check have parcel
  const parcel = await Parcel.findById(id).exec();
  if (!parcel) {
    return res.status(400).json({ message: "Parcel not found" });
  }

  const result = await Parcel.deleteOne(parcel);
  const reply = `Parcel ${parcel.parcelName} with ID ${parcel._id} deleted`;
  res.json(reply);
};

module.exports = {
  getAllParcels,
  createParcel,
  updateParcel,
  deleteParcel,
};
