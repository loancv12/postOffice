const express = require("express");
const router = express.Router();

const transactController = require("../controllers/transactsController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
  .route("/")
  .get(transactController.getAllTransacts)
  .post(transactController.createTransact)
  .patch(transactController.updateTransact)
  .delete(transactController.deleteTransact);

module.exports = router;
