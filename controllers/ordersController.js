const mongoose = require("mongoose");
const validate = require("../utils/validate");
const User = require("../models/User");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Parcel = require("../models/Parcel");

// desc get all orders
// route GET /orders
// access private
const getAllOrders = async (req, res) => {
  const orders = await Order.find().lean();
  if (!orders?.length) {
    return res.status(404).json({ message: "Dont have any order" });
  }

  // const ordersWith = await Promise.all(
  //   orders.map(async (order) => {
  //     const user = await User.findById(order.senderId);
  //     return { ...order, username: user.username };
  //   })
  // );

  res.json(orders);
};

// @desc create new order
// @route POST /orders
// @access private
const createOrder = async (req, res) => {
  const {
    parcelId,
    customerId,
    receiver,
    senderArea,
    receiveArea,
    deliveryCharge,
  } = req.body;

  // validate
  // Check all required
  if (
    !parcelId ||
    !customerId ||
    !receiver ||
    !senderArea ||
    !receiveArea ||
    !deliveryCharge
  ) {
    return res.status(400).json({ message: `All field is required` });
  }

  // Check receiver have required field
  function isSubArr(firstArray, secondArray) {
    return secondArray.every((e) => firstArray.includes(e));
  }
  const requiredFieldsReceiver = ["fullname", "address", "phone"];
  if (!isSubArr(Object.keys(receiver), requiredFieldsReceiver)) {
    return res
      .status(400)
      .json({ message: `all field of receiver is required` });
  }

  //   Check have parcel
  const parcel = await Parcel.findById(parcelId).exec();
  if (!parcel) {
    return res
      .status(400)
      .json({ message: "Parcel that transact assign not found" });
  }

  //   Check have customer
  const customer = await Customer.findById(customerId).exec();
  if (!customer) {
    return res
      .status(400)
      .json({ message: "Customer  that transact assign not found" });
  }

  const trackLocation = [senderArea];
  // create a order to db
  const orderObj = { ...req.body, trackLocation };
  const result = await Order.create(orderObj);
  if (result) {
    res.status(201).json({
      message: "Create order successful",
      orderId: result._id.toString(),
    });
  } else {
    res.status(400).json({ message: "Invalid order data received" });
  }
};

// @desc Update a order
// @route PATCH /orders
// @access Private
const updateOrder = async (req, res) => {
  const {
    id,
    receiver,
    receiveArea,
    deliveryCharge,
    status,
    trackLocation,
    back,
  } = req.body;

  // validate
  // Check all required
  if (
    !receiver ||
    !senderArea ||
    !receiveArea ||
    !deliveryCharge ||
    !status ||
    !trackLocation ||
    !back
  ) {
    return res.status(400).json({ message: `All field is required` });
  }

  // Check receiver have required field
  function isSubArr(firstArray, secondArray) {
    return secondArray.every((e) => firstArray.includes(e));
  }
  const requiredFieldsReceiver = ["fullname", "address", "phone"];
  if (isSubArr(Object.keys(receiver), requiredFieldsReceiver)) {
    return res
      .status(400)
      .json({ message: `all field of receiver is required` });
  }

  //   Check have customer
  const customer = await Customer.findById(id).exec();
  if (!customer) {
    return res
      .status(400)
      .json({ message: "Customer  that transact assign not found" });
  }

  order.receiver = receiver;
  order.senderArea = senderArea;
  order.receiveArea = receiveArea;
  order.deliveryCharge = deliveryCharge;
  order.status = status;
  order.trackLocation = trackLocation;
  order.back = back;

  const updateOrder = await order.save();
  res.json({ message: `${updateOrder.title} updated` });
};

// @desc Delete a order
// @route DELETE /orders
// @access Private
const deleteOrder = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Order ID required" });
  }

  //   Check have order
  const order = await Order.findById(id).exec();
  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  const result = await Order.deleteOne(order);
  const reply = `Order with ID ${order._id} deleted`;
  res.json(reply);
};

// @desc insert many order
// @route POST /orders/upload
// @access Private
const insertManyOrders = async (req, res) => {
  const orders = req.body;
  let errmsgList = [];

  const ordersWithUserId = await Promise.all(
    orders.map(async (order, i) => {
      // Check have user
      const user = await User.findOne({ username: order.user }).lean().exec();
      if (!user) {
        errmsgList.push({
          orderErrorIndex: i,
          status: 400,
          message: `Dont't find the user ${order.user}`,
        });
      } else {
        console.log("user", user);
        // Change field value of field 'user' from 'username' to 'userId'
        let orderObj = {
          ...order,
          user: user._id,
        };

        // validate newOrder and push error of each order to errmsgList
        const errmsg = await validateNewOrder(orderObj);
        if (errmsg) {
          errmsgList.push({
            orderErrorIndex: i,
            ...errmsg,
          });
        }
        return orderObj;
      }
    })
  );
  console.log("ordersWithUserId", ordersWithUserId);
  console.log("errmsgList", errmsgList);

  if (errmsgList.length) {
    console.log("errmsgList", errmsgList);
    return res.status(400).json({
      message: `Have ${errmsgList.length} error, revise you sheet `,
      detail: errmsgList,
    });
  }

  const result = await Order.insertMany(ordersWithUserId);
  console.log("result", result);
  if (result) {
    res.status(201).json({ message: "Create order successful" });
  } else {
    res.status(400).json({ message: "Invalid order data received" });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  insertManyOrders,
};
