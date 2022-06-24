import mongoose from "mongoose";
import { createAccount } from "../services/account.services.js";
import { updateUserCashAndCredit } from "../services/user.services.js";
import { Account } from "../models/account/account.model.js";
import { User } from "../models/user/user.model.js";

export const addAccount = async (req, res) => {
  try {
    const newAccount = await createAccount({
      ...req.body,
      owner: req.user._id,
    });
    req.user = await updateUserCashAndCredit(
      req.user,
      newAccount.cash,
      newAccount.credit
    );
    res.status(201).json({ newAccount });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.accountID),
      owner: req.user._id,
    });
    if (!account) {
      throw new Error("Unauthorized account delete attempt!");
    }
    if (account.cash < 0) {
      throw new Error("Cannot delete! Account is in dept.");
    }

    await account.remove();
    req.user = await updateUserCashAndCredit(
      req.user,
      -account.cash,
      -account.credit
    );
    res.status(202).json({ deletedAccount: account });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const depositToAccount = async (req, res) => {
  try {
    let account = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.accountID),
      owner: req.user._id,
    });
    if (!account) {
      account = await Account.findOne({
        _id: mongoose.Types.ObjectId(req.body.accountID),
        "usersAccess._id": req.user._id,
      });
      if (!account) {
        throw new Error("Invalid account deposit attempt!");
      }
      req.user = await User.findById(account.owner);
    }
    account.cash += req.body.amount;
    account.save();
    req.user = await updateUserCashAndCredit(req.user, req.body.amount, 0);
    res
      .status(200)
      .json({ message: `Successfully deposited ${req.body.amount}!` });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const withdrawFromAccount = async (req, res) => {
  try {
    let account = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.accountID),
      owner: req.user._id,
    });
    if (!account) {
      account = await Account.findOne({
        _id: mongoose.Types.ObjectId(req.body.accountID),
        "usersAccess._id": req.user._id,
      });
      if (!account) {
        throw new Error("Invalid account withdraw attempt!");
      }
      req.user = await User.findById(account.owner);
    }
    account.cash -= req.body.amount;
    account.save();
    req.user = await updateUserCashAndCredit(req.user, -req.body.amount, 0);
    res
      .status(200)
      .json({ message: `Successfully withdrawed ${req.body.amount}!` });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const transferToAccount = async (req, res) => {
  try {
    let fromAccount = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.fromAccountID),
      owner: req.user._id,
    });
    if (!fromAccount) {
      fromAccount = await Account.findOne({
        _id: mongoose.Types.ObjectId(req.body.fromAccountID),
        "usersAccess._id": req.user._id,
      });
      if (!fromAccount) {
        throw new Error("Invalid account transfer attempt!");
      }
      req.user = await User.findById(fromAccount.owner);
    }

    const toAccount = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.toAccountID),
    });

    if (!toAccount) {
      throw new Error("Invalid account transfer attempt!");
    }

    const toOwner = await User.findOne({
      _id: mongoose.Types.ObjectId(toAccount.owner),
    });

    fromAccount.cash -= req.body.amount;
    fromAccount.save();
    req.user = await updateUserCashAndCredit(req.user, -req.body.amount, 0);

    toAccount.cash += req.body.amount;
    toAccount.save();
    await updateUserCashAndCredit(toOwner, req.body.amount, 0);

    res
      .status(200)
      .json({ message: `Successfully transferred ${req.body.amount}!` });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const grantAccess = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.accountID),
      owner: req.user._id,
    });
    if (
      !account ||
      req.user._id.toString() ===
        mongoose.Types.ObjectId(req.body.toUser).toString()
    ) {
      throw new Error("Invalid granting account access attempt!");
    }

    const toUser = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.toUser),
    });

    if (!toUser) {
      throw new Error("Invalid granting account access attempt!");
    }

    account.usersAccess.forEach((user) => {
      if (user._id.toString() === toUser._id.toString()) {
        throw new Error(
          "Invalid granting account access attempt! User already has."
        );
      }
    });

    account.usersAccess = account.usersAccess.concat({ _id: toUser._id });

    await account.save();
    res.status(200).json({ message: "Successfully granted access!" });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const removeAccess = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.accountID),
      owner: req.user._id,
    });

    if (!account) {
      throw new Error("Invalid removing account access attempt!");
    }

    const fromUser = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.fromUser),
    });

    if (!fromUser) {
      throw new Error("Invalid removing account access attempt!");
    }

    account.usersAccess = account.usersAccess.filter((user) => {
      return user._id.toString() !== fromUser._id.toString();
    });

    await account.save();
    res.status(200).json({ message: "Successfully removed access!" });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const setAccActivity = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: mongoose.Types.ObjectId(req.body.accountID),
      owner: req.user._id,
    });

    if (!account) {
      throw new Error("Invalid setting activity attempt!");
    }

    account.isActive = req.body.isActive;

    await account.save();
    res.status(200).json({ message: "Successfully set activity!" });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};
