import { User } from "../models/user/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    const token = await newUser.generateAuthToken();
    res.status(201).json({ newUser, token });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};
