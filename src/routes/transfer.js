import express from "express";

import { withdraw, depositOrUpdateCredit } from "../accounts-exports.js";
import { checkAPIKey } from "../api-exports.js";

const transferRouter = express.Router();

transferRouter.use(express.json());
transferRouter.use(
  express.urlencoded({
    extended: true,
  })
);

transferRouter.put("/api/transfer", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      if (
        !req.body.passportID ||
        !req.body.amount ||
        !req.body.fromAccountID ||
        !req.body.toAccountID
      ) {
        throw new Error(
          "Missing params! must provide passportID, fromAccountID, toAccountID and amount to transfer."
        );
      } else if (req.body.amount < 0) {
        throw new Error("Amount must be a positive number!");
      }
      withdraw(
        req.body.passportID,
        req.body.fromAccountID,
        req.body.amount,
        req.query.apiKey
      );
      depositOrUpdateCredit(
        req.body.toAccountID,
        req.body.amount,
        null,
        req.query.apiKey
      );
      res.json({
        message: "Success!",
        passportID: req.body.passportID,
        fromAccountID: req.body.fromAccountID,
        toAccountID: req.body.toAccountID,
        amount: req.body.amount,
      });
    }
  } catch (err) {
    if (err.message === `Account ID: ${req.body.toAccountID} does not exist!`) {
      depositOrUpdateCredit(
        req.body.fromAccountID,
        req.body.amount,
        null,
        req.query.apiKey
      );
    }
    res.status(400).json({ code: 400, message: err.message });
  }
});

export default transferRouter;
