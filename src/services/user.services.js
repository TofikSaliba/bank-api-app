import { User } from "../models/user/user.model.js";

export const createUser = (user) => {
  user.email = user.email.toLowerCase();
  const newUser = new User(user);
  return newUser.save();
};

export const updateUserCashAndCredit = async (user, cash, credit) => {
  user.cash += cash;
  user.credit += credit;

  return await user.save();
};
