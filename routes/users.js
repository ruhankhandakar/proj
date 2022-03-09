const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

/* 
@route      POST api/users
@desc       Register a user
@access     Private - Only for admin
*/
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "valid email is required").isEmail(),
    check("password", "password should be greater than 5").isLength({ min: 5 }),
    check("roleId", "roleId must be a number").not().isEmpty(),
    authMiddleware,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({ msg: "Authentication Failed" });
    }

    const loggedInUserRoleId = user.roleId;
    if (loggedInUserRoleId !== 0) {
      // as 0 is for admin
      return res.status(400).json({ msg: "Authentication Failed" });
    }

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, password, roleId } = req.body;

    try {
      let newUser = await User.findOne({ email });
      if (newUser) {
        return res.status(400).json({ msg: "Duplicate Entry" });
      }
      newUser = new User({ name, email, password, roleId, adminId: user.id });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();

      const payload = {
        user: {
          id: newUser.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.json({ token });
        }
      );
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  }
);

router.get("/", [authMiddleware], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({ msg: "Authentication Failed" });
    }

    const loggedInUserRoleId = user.roleId;
    if (loggedInUserRoleId !== 0) {
      // as 0 is for admin
      return res.status(400).json({ msg: "Authentication Failed" });
    }
    const allUsersForTheAdmin = await User.find({
      adminId: user._id,
    }).select("-password -__v");

    return res.json({ data: allUsersForTheAdmin });
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});
module.exports = router;
