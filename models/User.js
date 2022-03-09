const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  roleId: {
    type: Number,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", UserSchema);
