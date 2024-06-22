const express = require("express");
const {
  createUser,
  verifyEmail,
  loginUser,
  getAllUsers,
} = require("./user.controller");
const router = express.Router();

router.post("/signup", createUser);
router.post("/email-verify/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/all", getAllUsers);

module.exports = { userRoutes: router };
