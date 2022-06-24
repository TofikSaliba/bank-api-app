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

export const filterUsersOrAccounts = async (req, res, next, filterModel) => {
  try {
    if (!req.user.admin) {
      throw new Error("Only admins has access to this!");
    }
    if (
      (req.query.min === undefined && req.query.max === undefined) ||
      (req.query.min !== undefined && isNaN(Number(req.query.min))) ||
      (req.query.max !== undefined && isNaN(Number(req.query.max)))
    ) {
      throw new Error(
        "Error!min and max query must be numbers! and must provide at least one"
      );
    }

    let min = req.query.min ?? -999999999999999,
      max = req.query.max ?? 999999999999999;

    let filtered;
    if (filterModel === "Users") {
      filtered = await User.find({}).where("cash").gte(min).lte(max);
    } else {
      filtered = await Account.find({}).where("cash").gte(min).lte(max);
    }
    res.json({ filtered });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const filterActiveAccounts = async (req, res) => {
  try {
    if (!req.user.admin) {
      throw new Error("Only admins has access to this!");
    }
    if (req.query.isActive !== "true" && req.query.isActive !== "false") {
      throw new Error("Error!isActive must be true or false");
    }
    const isActive = req.query.isActive === "true" ? true : false;

    const filteredAccounts = await Account.find({ isActive });
    res.json({ filteredAccounts });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};
