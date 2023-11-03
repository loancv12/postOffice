const express = require("express");
const router = express.Router();

const parcelController = require("../controllers/parcelsController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
  .route("/")
  .get(parcelController.getAllParcels)
  .post(parcelController.createParcel)
  .patch(parcelController.updateParcel)
  .delete(parcelController.deleteParcel);

module.exports = router;
