import express from "express";

import { deleteAccount } from "../accounts-exports.js";
import { checkAPIKey } from "../api-exports.js";

const deleteAccountRouter = express.Router();

deleteAccountRouter.use(express.json());
deleteAccountRouter.use(
  express.urlencoded({
    extended: true,
  })
);

deleteAccountRouter.delete("/api/deleteAccount", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      if (!req.body.passportID || !req.body.accountID) {
        throw new Error(
          "Missing params! must provide passportID and accountID to delete."
        );
      }
      const cash = deleteAccount(
        req.body.passportID,
        req.body.accountID,
        req.query.apiKey
      );
      res.json({
        message: `Success! Account ID: ${req.body.accountID} of user ${req.body.passportID} is now deleted. cash returned from account is: ${cash}`,
      });
    }
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
});

export default deleteAccountRouter;
