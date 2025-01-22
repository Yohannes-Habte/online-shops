import express from "express";
import {
  deleteUser,
  deleteUserAddress,
  getUser,
  getUsers,
  updateUserAddress,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

// Auth Router
const userRouter = express.Router();

// User routes
userRouter.get("/user", isAuthenticated, getUser);
userRouter.get("/", getUsers);
userRouter.put("/:id/update-user-address/", updateUserAddress);
userRouter.delete("/delete-user-address/:id", deleteUserAddress);
userRouter.delete("/delete-user/:id", deleteUser);

// Export auth Router
export default userRouter;
