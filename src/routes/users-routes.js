import express from "express";
import { auth } from "../middleware/auth.js";

import {
  addUser,
  loginUser,
  logoutUser,
  logoutAll,
  deleteUser,
  getUserProfile,
} from "../controllers/user.controllers.js";

const usersRouter = express.Router();

usersRouter.post("/signUp", addUser);

usersRouter.post("/login", loginUser);
usersRouter.post("/logout", auth, logoutUser);
usersRouter.post("/logoutAll", auth, logoutAll);

usersRouter.get("/profile", auth, getUserProfile);

usersRouter.delete("/deleteUser", auth, deleteUser);

export { usersRouter };
