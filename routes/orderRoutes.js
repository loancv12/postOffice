const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/ordersController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);
router.route("/upload").post(ordersController.insertManyOrders);

router
  .route("/")
  .get(ordersController.getAllOrders)
  .post(ordersController.createOrder)
  .patch(ordersController.updateOrder)
  .delete(ordersController.deleteOrder);

module.exports = router;
