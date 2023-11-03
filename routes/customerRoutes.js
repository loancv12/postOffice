const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customersController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;
