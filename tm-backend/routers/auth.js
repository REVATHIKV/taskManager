const express = require("express");
const { validateSignup, validateLogin } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, email, password, role } = req.body;

    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
      throw new Error("Email already exists !! ");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: role || "user",
    });

    const savedData = await user.save();
    res.json({ message: "User signedup successfully", data: savedData });
  } catch (err) {
    res.status(400).json({ message:   err.message });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { email, password } = req.body;
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      throw new Error("Invalid Credentials");
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (validPassword) {
      const token = await jwt.sign(
        { _id: validUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("token", token, {  expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
      res.json({ message: "User loggedIn successfully", data: validUser });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).json({ message:   err.message });
  }
});
authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", { expiresIn: Date.now() });
  res.json({ message: "LoggedOut successfully" });
});

module.exports = authRouter;
