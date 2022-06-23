import { createUser } from "../services/user.services.js";
import { User } from "../models/user/user.model.js";

export const addUser = async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    const token = await newUser.generateAuthToken();
    res.status(201).json({ newUser, token });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.json({ message: "successfully logged out!" });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

export const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json({ message: "successfully logged out from all sessions!" });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.json({
      deletedUser: req.user,
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    res.json({ currentUser: req.user });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
