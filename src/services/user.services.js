import { User } from "../models/user/user.model.js";

export const createUser = (user) => {
  console.log(user);
  const newUser = new User(user);
  return newUser.save();
};
