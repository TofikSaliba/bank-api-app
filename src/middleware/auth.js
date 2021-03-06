import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/user/user.model.js";
import { Account } from "../models/account/account.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    if (req.user.admin && (req.body.accountID || req.body.fromAccountID)) {
      const accID = req.body.accountID ?? req.body.fromAccountID;
      const account = await Account.findById(accID);
      if (!account) {
        throw new Error();
      }
      if (req.user._id.toString() !== account.owner.toString()) {
        req.user = await User.findById(account.owner);
      }
    } else if (req.body.userID) {
      const user = await User.findById(req.body.userID);
      if (!req.user.admin || !user) {
        throw new Error();
      }
      req.user = user;
      delete req.body.userID;
    }
    next();
  } catch (err) {
    res.status(400).json({ error: "Failed admin authentication!" });
  }
};
