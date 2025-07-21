const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const bcrypt = require("bcrypt");

profileRouter.get("/viewProfile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({ message: "Profle details listed below", data: user });
  } catch (err) {
    res.status(400).json({ message: "something went wrong " + err.message });
  }
});
profileRouter.patch("/editProfile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const inputFields = req.body;
    const allowedUpdateFields = ["firstName", "lastName", "about", "photoUrl"];
    const allowUpdate = Object.keys(inputFields).every((value) => {
      return allowedUpdateFields.includes(value);
    });
    if (!allowUpdate) {
      throw new Error("invalid Edit request !! ");
    }

    Object.keys(inputFields).forEach((value) => {
      loggedInUser[value] = inputFields[value];
    });
    const savedData = await loggedInUser.save();
    res.json({ message: "Data updated ", data: savedData });
  } catch (err) {
    res.status(400).json({ message: "something went wrong " + err.message });
  }
});



profileRouter.patch("/resetpassword", userAuth, async (req, res) => {
  try {
    
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    const validPassword = await bcrypt.compare(
      oldPassword,
      loggedInUser.password
    );
    if (!validPassword) {
      throw new Error("Old Password is incorrect. Try again");
    }

    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    const passwordUpdated = await loggedInUser.save();

    res.json({
      message: "Password Changed successfully",
      data: passwordUpdated,
    });
  } catch (err) {
    res.status(200).json({ message: "Something went wrong !! " + err.message });
  }
});
module.exports = profileRouter;
