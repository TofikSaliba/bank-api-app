import mongoose from "mongoose";
import { User } from "../user/user.model.js";
import { accountSchema } from "./account.schema.js";

accountSchema.methods.grantAccess = async function (toUserID) {
  const account = this;
  const toUser = await User.findOne({
    _id: mongoose.Types.ObjectId(toUserID),
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
};

accountSchema.methods.removeAcess = async function (fromUserID) {
  const account = this;
  const fromUser = await User.findOne({
    _id: mongoose.Types.ObjectId(fromUserID),
  });
  if (!fromUser) {
    throw new Error("Invalid removing account access attempt!");
  }

  account.usersAccess = account.usersAccess.filter((user) => {
    return user._id.toString() !== fromUser._id.toString();
  });
  await account.save();
};

const Account = mongoose.model("Account", accountSchema);

export { Account };
