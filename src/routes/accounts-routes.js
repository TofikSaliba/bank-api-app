import express from "express";
import { auth } from "../middleware/auth.js";

import {
  addAccount,
  deleteAccount,
  depositToAccount,
  withdrawFromAccount,
  transferToAccount,
  grantAccess,
  removeAccess,
  setAccActivity,
} from "../controllers/account.controllers.js";

const accountsRouter = express.Router();

accountsRouter.post("/addAccount", auth, addAccount);
accountsRouter.delete("/deleteAccount", auth, deleteAccount);
accountsRouter.put("/deposit", auth, depositToAccount);
accountsRouter.put("/withdraw", auth, withdrawFromAccount);
accountsRouter.put("/transfer", auth, transferToAccount);
accountsRouter.put("/grantAccess", auth, grantAccess);
accountsRouter.put("/removeAccess", auth, removeAccess);
accountsRouter.put("/setActivity", auth, setAccActivity);

export { accountsRouter };
