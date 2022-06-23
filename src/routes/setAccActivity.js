import express from "express";

import { setAccActivity } from "../accounts-exports.js";
import { checkAPIKey } from "../api-exports.js";

const setAccActivityRouter = express.Router();

setAccActivityRouter.use(express.json());
setAccActivityRouter.use(
  express.urlencoded({
    extended: true,
  })
);

setAccActivityRouter.put("/api/setAccActivity", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      if (
        !req.body.passportID ||
        !req.body.accountID ||
        req.body.isActive === undefined
      ) {
        throw new Error(
          "Missing params! must provide passportID, accountID and isActive boolean."
        );
      } else if (req.body.isActive !== true && req.body.isActive !== false) {
        throw new Error("isActive must be a boolean value!");
      }
      setAccActivity(
        req.body.passportID,
        req.body.accountID,
        req.body.isActive,
        req.query.apiKey
      );
      res.json({
        message: `Success! Account ID: ${req.body.accountID} activity is set to: ${req.body.isActive}`,
      });
    }
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
});

export default setAccActivityRouter;
