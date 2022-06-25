import mongoose from "mongoose";
import { Account } from "../models/account/account.model.js";
import { User } from "../models/user/user.model.js";
import { updateUserCashAndCredit } from "./user.services.js";

export const createAccount = async (account, user) => {
  const newAccount = new Account(account);
  await updateUserCashAndCredit(user, newAccount.cash, newAccount.credit);
  return await newAccount.save();
};

export const removeAccount = async (account, user) => {
  await account.remove();
  await updateUserCashAndCredit(user, -account.cash, -account.credit);
};

export const checkIfFound = async (accountID, user, transaction) => {
  let account = await Account.findOne({
    _id: mongoose.Types.ObjectId(accountID),
    owner: user._id,
  });
  if (!account) {
    account = await Account.findOne({
      _id: mongoose.Types.ObjectId(accountID),
      "usersAccess._id": user._id,
    });
    if (!account) {
      throw new Error(`Invalid account ${transaction} attempt!`);
    }
    user = await User.findById(account.owner);
  }
  return { account, user };
};

export const checkToAccountValid = async (toAccountID) => {
  const toAccount = await Account.findOne({
    _id: mongoose.Types.ObjectId(toAccountID),
  });
  if (!toAccount) {
    throw new Error("Invalid account transfer attempt!");
  }
  const toOwner = await User.findOne({
    _id: mongoose.Types.ObjectId(toAccount.owner),
  });
  return { toAccount, toOwner };
};

export const saveTransferChanges = async (
  fromAccount,
  toAccount,
  amount,
  user,
  toOwner
) => {
  fromAccount.cash -= amount;
  await fromAccount.save();

  toAccount.cash += amount;
  await toAccount.save();
  if (user._id.toString() !== toOwner._id.toString()) {
    await updateUserCashAndCredit(user, -amount, 0);
    await updateUserCashAndCredit(toOwner, amount, 0);
  }
};
