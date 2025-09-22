import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCSESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ email, password, name });

  // authenticate user
  const { accessToken, refreshToken } = generateTokens(user._id);

  res.status(201).json({ user, message: "User created succesfully" });
};

export const login = async (req, res) => {
  res.send("Login route called");
};
export const logout = async (req, res) => {
  res.send("Logout route called");
};
