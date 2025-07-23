const mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
  taskName: { type: String, required: true },
  status: {
    type: String,
    validate: {
      validator: function (value) {
        return ["Pending", "Completed"].includes(value);
      },
      message: "Invalid Status",
    },
    default:"Pending",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
