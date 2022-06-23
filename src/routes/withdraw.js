import express from "express";

import { withdraw } from "../accounts-exports.js";
import { checkAPIKey } from "../api-exports.js";

const withdrawRouter = express.Router();

withdrawRouter.use(express.json());
withdrawRouter.use(
  express.urlencoded({
    extended: true,
  })
);

withdrawRouter.put("/api/withdraw", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      if (!req.body.passportID || !req.body.amount || !req.body.accountID) {
        throw new Error(
          "Missing params! must provide passportID, accountID and amount to withdraw."
        );
      } else if (req.body.amount < 0) {
        throw new Error("Amount must be a positive number!");
      }
      withdraw(
        req.body.passportID,
        req.body.accountID,
        req.body.amount,
        req.query.apiKey
      );
      res.json({
        message: "Success!",
        passportID: req.body.passportID,
        fromAccountID: req.body.accountID,
        amount: req.body.amount,
      });
    }
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
});

export default withdrawRouter;
