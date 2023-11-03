const express = require("express");
const router = express.Router();

const gatherController = require("../controllers/gathersController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
  .route("/")
  .get(gatherController.getAllGathers)
  .post(gatherController.createGather)
  .patch(gatherController.updateGather)
  .delete(gatherController.deleteGather);

module.exports = router;
