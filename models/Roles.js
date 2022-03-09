const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
  name: {
    type: String,
  },
  roleId: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("role", RoleSchema);
