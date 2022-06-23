import { createAccount } from "../services/account.services.js";

export const addAccount = async (req, res) => {
  try {
    const newAccount = await createAccount({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json({ newAccount });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};
