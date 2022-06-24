import mongoose from "mongoose";
import {
  createAccount,
  removeAccount,
  checkIfFound,
  saveTransferChanges,
  checkToAccountValid,
} from "../services/account.services.js";
import { updateUserCashAndCredit } from "../services/user.services.js";
import { Account } from "../models/account/account.model.js";
import { User } from "../models/user/user.model.js";

export const addAccount = async (req, res) => {
  try {
    const newAccount = await createAccount(
      {
        ...req.body,
        owner: req.user._id,
      },
      req.user
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

    await removeAccount(account, req.user);
    res.status(202).json({ deletedAccount: account });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const depositToAccount = async (req, res) => {
  try {
    const { account, user } = await checkIfFound(
      req.body.accountID,
      req.user,
      "deposit"
    );

    account.cash += req.body.amount;
    account.save();
    await updateUserCashAndCredit(user, req.body.amount, 0);
    res
      .status(200)
      .json({ message: `Successfully deposited ${req.body.amount}!` });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const withdrawFromAccount = async (req, res) => {
  try {
    const { account, user } = await checkIfFound(
      req.body.accountID,
      req.user,
      "withdraw"
    );
    if (account.cash - req.body.amount < -account.credit) {
      throw new Error("Insufficient funds! amount not available.");
    }

    account.cash -= req.body.amount;
    account.save();
    await updateUserCashAndCredit(user, -req.body.amount, 0);
    res
      .status(200)
      .json({ message: `Successfully withdrawed ${req.body.amount}!` });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

export const transferToAccount = async (req, res) => {
  try {
    const { account, user } = await checkIfFound(
      req.body.fromAccountID,
      req.user,
      "transfer"
    );
    if (account.cash - req.body.amount < -account.credit) {
      throw new Error("Insufficient funds! amount not available.");
    }

    const fromAccount = account;
    const { toAccount, toOwner } = await checkToAccountValid(
      req.body.toAccountID
    );

    await saveTransferChanges(
      fromAccount,
      toAccount,
      req.body.amount,
      user,
      toOwner
    );

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

    await account.grantAccess(req.body.toUser);

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

    await account.removeAcess(req.body.fromUser);

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
