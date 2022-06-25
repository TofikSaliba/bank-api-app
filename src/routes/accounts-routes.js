import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";

import {
  addAccount,
  getAccounts,
  deleteAccount,
  depositToAccount,
  withdrawFromAccount,
  transferToAccount,
  grantAccess,
  removeAccess,
  setAccActivity,
} from "../controllers/account.controllers.js";

const accountsRouter = express.Router();

accountsRouter.post("/addAccount", auth, adminAuth, addAccount);
accountsRouter.get("/ownAccounts", auth, getAccounts);

accountsRouter.put("/deposit", auth, adminAuth, depositToAccount);
accountsRouter.put("/withdraw", auth, adminAuth, withdrawFromAccount);
accountsRouter.put("/transfer", auth, adminAuth, transferToAccount);
accountsRouter.put("/grantAccess", auth, adminAuth, grantAccess);
accountsRouter.put("/removeAccess", auth, adminAuth, removeAccess);
accountsRouter.put("/setActivity", auth, adminAuth, setAccActivity);

accountsRouter.delete("/deleteAccount", auth, deleteAccount);

export { accountsRouter };
