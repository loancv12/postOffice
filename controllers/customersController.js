const mongoose = require("mongoose");

const User = require("../models/User");
const Customer = require("../models/Customer");
const validate = require("../utils/validate");

// desc get all customers
// route GET /customers
// access private
const getAllCustomers = async (req, res) => {
  const customers = await Customer.find().lean();
  if (!customers?.length) {
    return res.status(404).json({ message: "Dont have any customer" });
  }

  res.json(customers);
};

// @desc create new customer
// @route POST /customers
// @access private
const createCustomer = async (req, res) => {
  const { fullname, address, phone } = req.body;

  // validate
  // Check all required
  if (!fullname || !address || !phone) {
    return res.status(400).json({ message: `All field is required` });
  }
  // Check for duplicate customer
  const duplicate = await Customer.findOne({ fullname, address, phone })
    .collation({
      // The ICU locale
      locale: "en",
      // The level of comparison to perform: 2: thuc hien so sanh chu ki tu va dau phu, ko tinh case hoa, thuong
      strength: 2,
    })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate customer" });
  }

  const customerObj = {
    fullname,
    address,
    phone,
  };
  const result = await Customer.create(customerObj);
  console.log(result);
  if (result) {
    res
      .status(201)
      .json({
        message: "Create customer successful",
        customerId: result._id.toString(),
      });
  } else {
    res.status(400).json({ message: "Invalid customer data received" });
  }
};

// @desc Update a customer
// @route PATCH /customers
// @access Private
const updateCustomer = async (req, res) => {
  const { id, fullname, address, phone } = req.body;

  // validate
  // Check all required
  if (!fullname || !address || !phone) {
    return res.status(400).json({ message: `All field is required` });
  }
  //   Check have customer'
  const customer = await User.findById(id).exec();
  if (!customer) {
    return res.status(400).json({ message: "Leader not found" });
  }
  // Check for duplicate customer
  const duplicate = await Transact.findOne({ fullname, address, phone })
    .collation({
      // The ICU locale
      locale: "en",
      // The level of comparison to perform: 2: thuc hien so sanh chu ki tu va dau phu, ko tinh case hoa, thuong
      strength: 2,
    })
    .lean()
    .exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate customer" });
  }

  customer.fullname = fullname;
  customer.address = address;
  customer.phone = phone;

  const updateCustomer = await customer.save();
  res.json({ message: `${updateCustomer.name} updated` });
};

// @desc Delete a customer
// @route DELETE /customers
// @access Private
const deleteCustomer = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Customer ID required" });
  }

  //   Check have customer
  const customer = await Customer.findById(id).exec();
  if (!customer) {
    return res.status(400).json({ message: "Customer not found" });
  }

  const result = await Customer.deleteOne(customer);
  const reply = `Customer ${customer.fullname} with ID ${customer._id} deleted`;
  res.json(reply);
};

module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
