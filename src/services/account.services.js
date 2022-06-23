import { Account } from "../models/account/account.model.js";

export const createAccount = (account) => {
  const newAccount = new Account(account);
  return newAccount.save();
};
