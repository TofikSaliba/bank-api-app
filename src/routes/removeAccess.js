import express from "express";

import { removeAccessToAccount } from "../accounts-exports.js";
import { checkAPIKey } from "../api-exports.js";

const removeAccessToAccountRouter = express.Router();

removeAccessToAccountRouter.use(express.json());
removeAccessToAccountRouter.use(
  express.urlencoded({
    extended: true,
  })
);

removeAccessToAccountRouter.delete("/api/removeAccess", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      if (!req.body.ownerID || !req.body.accountID || !req.body.accessID) {
        throw new Error(
          "Missing params! must provide ownerID, accountID and accessID for the accout to remove access to"
        );
      }
      removeAccessToAccount(
        req.body.ownerID,
        req.body.accessID,
        req.body.accountID,
        req.query.apiKey
      );
      res.json({
        message: `Success! passportID: ${req.body.accessID} has now no access to the account: ${req.body.accountID}`,
      });
    }
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
});

export default removeAccessToAccountRouter;
