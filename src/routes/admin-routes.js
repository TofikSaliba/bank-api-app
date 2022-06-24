import express from "express";

import { auth, adminAuth } from "../middleware/auth.js";

import {
  getAllUsers,
  getAllAccounts,
  updateCredit,
  filterUsersOrAccounts,
  filterActiveAccounts,
} from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.get("/getAllUsers", auth, getAllUsers);
adminRouter.get("/getAllAccounts", auth, getAllAccounts);

adminRouter.get("/filterUsers", auth, (req, res, next) =>
  filterUsersOrAccounts(req, res, next, "Users")
);
adminRouter.get("/filterAcccounts", auth, (req, res, next) =>
  filterUsersOrAccounts(req, res, next, "Accounts")
);

adminRouter.get("/filterActiveAccounts", auth, filterActiveAccounts);

adminRouter.patch("/updateCredit", auth, adminAuth, updateCredit);

export { adminRouter };
