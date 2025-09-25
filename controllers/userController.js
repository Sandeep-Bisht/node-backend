const User = require("../models/userModel");

// @desc   Get all users
// @route  GET /api/users
const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// @desc   Create new user
// @route  POST /api/users
const createUser = async (req, res) => {
  const { name, mobile } = req.body;
  const user = new User({ name, mobile });
  await user.save();
  res.status(201).json(user);
};

module.exports = { getUsers, createUser };
