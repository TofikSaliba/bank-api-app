import express from "express";

import { depositOrUpdateCredit } from "../accounts-exports.js";
import { checkAPIKey } from "../api-exports.js";

const updateCreditRouter = express.Router();

updateCreditRouter.use(express.json());
updateCreditRouter.use(
  express.urlencoded({
    extended: true,
  })
);

updateCreditRouter.put("/api/updateCredit", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      if (!req.body.newCredit || !req.body.accountID) {
        throw new Error(
          "Missing params! must provide accountID and newCredit to set."
        );
      } else if (req.body.newCredit < 0) {
        throw new Error("newCredit must be a positive number!");
      }
      depositOrUpdateCredit(
        req.body.accountID,
        0,
        req.body.newCredit,
        req.query.apiKey
      );
      res.json({
        message: "Success!",
        newCredit: req.body.newCredit,
        toAccountID: req.body.accountID,
      });
    }
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
});

export default updateCreditRouter;
