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
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Task", taskSchema);
