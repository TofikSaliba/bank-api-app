import express from "express";
import { auth } from "../middleware/auth.js";

import { addAccount } from "../controllers/account.controllers.js";

const accountsRouter = express.Router();

accountsRouter.post("/addAccount", auth, addAccount);

export { accountsRouter };
