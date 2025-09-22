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

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 // 7 days
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevents XSS attacks, cross site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevents XSS attacks, cross site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
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
  await storeRefreshToken(user._id, refreshToken);

  setCookies(res, accessToken, refreshToken);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "User created succesfully",
  });
};

export const login = async (req, res) => {
  res.send("Login route called");
};
export const logout = async (req, res) => {
  res.send("Logout route called");
};
