import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const register = async (req, res) => {
  //   await connectDB();
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // await connectDB();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true },
    );

    res.json({
      token: req.headers.authorization.split(" ")[1],
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true },
  );

  res.json({
    token: req.headers.authorization.split(" ")[1],
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.json({ message: "Password updated successfully" });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json({
    token: req.headers.authorization.split(" ")[1],
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};
