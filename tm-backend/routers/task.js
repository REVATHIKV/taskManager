const express = require("express");
const taskRouter = express.Router();

taskRouter.post("/task", async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({ message: "something went wrong " + err.message });
  }
});
taskRouter.patch("/task/:id", async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({ message: "something went wrong " + err.message });
  }
});
taskRouter.delete("/task/:id", async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({ message: "something went wrong " + err.message });
  }
});
taskRouter.get("/tasks", async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({ message: "something went wrong " + err.message });
  }
});

module.exports = taskRouter;
