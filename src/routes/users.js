const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");

router.post("/users/signup", userController.create);
router.get("/users/signup", userController.signup);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.post("/users", validation.validateUsers, userController.create);


module.exports = router;