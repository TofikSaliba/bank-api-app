import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";

import {
  addUser,
  loginUser,
  logoutUser,
  logoutAll,
  deleteUser,
  getUserProfile,
  editProfile,
} from "../controllers/user.controllers.js";

const usersRouter = express.Router();

usersRouter.post("/signUp", addUser);
usersRouter.post("/login", loginUser);
usersRouter.post("/logout", auth, logoutUser);
usersRouter.post("/logoutAll", auth, logoutAll);

usersRouter.get("/profile", auth, adminAuth, getUserProfile);
usersRouter.patch("/editProfile", auth, adminAuth, editProfile);

usersRouter.delete("/deleteUser", auth, adminAuth, deleteUser);

export { usersRouter };
