const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const isalredyexist = await userModel.findOne({
    email,
  });

  if (isalredyexist) {
    return res.status(400).json({
      message: "already register email",
    });
  }

  const hashpassword = await bcryptjs.hash(password, 10);

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashpassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "register user successfully",
    user: {
      email: user.email,
      _id: user._id,
      fullName: user.fullName,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "unauthorized token : invalid",
    });
  }

  const ispasswordvalid = await bcryptjs.compare(password, user.password);

  if (!ispasswordvalid) {
    return res.status(400).json({
      message: "invalid password! enter valide password",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      email: user.email,
      _id: user._id,
      fullName: user.fullName,
    },
  });
}

module.exports = {
  registerUser,
  loginUser
};
