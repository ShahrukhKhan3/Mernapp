const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../modal/userschema");
const jwt = require("jsonwebtoken");
const { requireLogin } = require("../middleware/auth");
const router = express.Router();
///------------------- to register a user///---------------------
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "user already exist" });
    }
    const hashed_password = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashed_password,
    });
    await user.save();
    return res.status(201).json({ message: "user created successfuly" });
  } catch (error) {
    console.log(error.message);
  }
});

//Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "invalid Credientialls" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "invalid-Credientials" });
    }
    const token = jwt.sign({ _id: user._id }, "secretweb");
    return res.json({ token });
  } catch (error) {
    console.log(error);
  }
});
router.get("/", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    res.json(user);
  } catch (error) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
});
module.exports = router;
