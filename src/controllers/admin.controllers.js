import mongoose from "mongoose";
import { User } from "../models/user/user.model.js";
import { Account } from "../models/account/account.model.js";
import { updateUserCashAndCredit } from "../services/user.services.js";

export const getAllUsers = async (req, res) => {
  try {
    if (!req.user.admin) {
      throw new Error("Only admins has access to this!");
    }
    const allUsers = await User.find({});
    res.status(200).json({ allUsers });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    if (!req.user.admin) {
      throw new Error("Only admins has access to this!");
    }
    const allAccounts = await Account.find({}).populate("owner");
    res.status(200).json({ allAccounts });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const updateCredit = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.accountID),
      owner: req.user._id,
    });
    if (!account) {
      throw new Error("Unauthorized credit update attempt!");
    }

    const creditDiff = req.body.newCredit - account.credit;

    account.credit = req.body.newCredit;
    await account.save();

    await updateUserCashAndCredit(req.user, 0, creditDiff);

    res.json({
      message: "Success!",
      updatedUser: await account.populate("owner"),
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};
