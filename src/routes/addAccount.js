import express from "express";

import { createAccount } from "../accounts-exports.js";
import { checkAPIKey } from "../api-exports.js";

const addAccountRouter = express.Router();

addAccountRouter.use(express.json());
addAccountRouter.use(
  express.urlencoded({
    extended: true,
  })
);

addAccountRouter.post("/api/addAccount", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      const newAccount = createAccount(req.body, req.query.apiKey);
      res.status(201).json(newAccount);
    }
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
});

export default addAccountRouter;
