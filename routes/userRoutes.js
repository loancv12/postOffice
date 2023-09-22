const express = require("express");
const router = express.Router();
const path = require("path");
const usersController = require("../controllers/usersController");

// path just / or /index or /index.html
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
