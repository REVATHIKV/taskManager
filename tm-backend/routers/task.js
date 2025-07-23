const express = require("express");
const taskRouter = express.Router();
const Task = require("../models/task");
const userAuth = require("../middlewares/userAuth");

taskRouter.post("/task", userAuth, async (req, res) => {
  try {
    const { taskName, assignedTo } = req.body;
    const loggedInUser = req.user;

    const task = new Task({
      taskName,
      assignedTo,
      createdBy: loggedInUser._id,
    });
    const savedData = await task.save();
    res.json({ message: "Task added successfully", data: savedData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
taskRouter.patch("/statusUpdate/:id/:status", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let taskToUpdate;
    const _id = req.params.id;
    const status = req.params.status;

    if (loggedInUser.role == "admin") {
      taskToUpdate = await Task.findOne({ _id: _id });
    } else {
      taskToUpdate = await Task.findOne({
        _id: _id,
        createdBy: loggedInUser._id,
      });
    }
    if (!taskToUpdate) {
      throw new Error("You are not allowed to update this task");
    }

    taskToUpdate.status = status;
    const task = await taskToUpdate.save();
    res.json({ message: "Status updated successfully", data: task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

taskRouter.patch("/task/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let taskToUpdate;
    const _id = req.params.id;

    const allowedUpdates = ["taskName", "status", "assignedTo"];
    const validUpdate = Object.keys(req.body).every((value) => {
      return allowedUpdates.includes(value);
    });
    if (!validUpdate) {
      throw new Error("Invalid update request !! ");
    }

    const updatedData = req.body;

    if (loggedInUser.role == "admin") {
      taskToUpdate = await Task.findOne({ _id: _id });
    } else {
      taskToUpdate = await Task.findOne({
        _id: _id,
        createdBy: loggedInUser._id,
      });
    }
    if (!taskToUpdate) {
      throw new Error("You are not allowed to update this task");
    }

    Object.keys(updatedData).forEach((value) => {
      taskToUpdate[value] = updatedData[value];
    });

    const task = await taskToUpdate.save();
    res.json({ message: "Task updated successfully", data: task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
taskRouter.delete("/task/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const _id = req.params.id;
    let allowedToDelete;
    if (loggedInUser.role == "admin") {
      allowedToDelete = await Task.findOne({
        _id: _id,
      });
    } else {
      allowedToDelete = await Task.findOne({
        _id: _id,
        createdBy: loggedInUser._id,
      });
    }

    if (!allowedToDelete) {
      throw new Error("You are not allowed to delete this task !! ");
    }
    const taskDelete = await Task.deleteOne({
      _id: _id,
    });
    res.json({ message: "Task deleted successfully", data: taskDelete });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
taskRouter.get("/tasks/:status", userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const loggedInUser = req.user;
    const query = {};

    if (status !== "all") {
      query.status = status;
    }

    if (loggedInUser.role != "admin") {
      query.assignedTo = loggedInUser._id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "firstName lastName")
      .populate("createdBy", "firstName lastName");

    res.json({ message: `${status}` + " Tasks lisetd below ", data: tasks });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = taskRouter;
