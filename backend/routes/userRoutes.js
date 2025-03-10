import express from "express";
import {
  deleteUser,
  deleteUserAddress,
  getUser,
  getUserInfo,
  getUsers,
  updateUserAddress,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

// Auth Router
const userRouter = express.Router();

// User routes
userRouter.get("/user", isAuthenticated, getUser);
userRouter.get("/", getUsers);
userRouter.get("/user-info/:id", getUserInfo);
userRouter.put("/user/address/", isAuthenticated, updateUserAddress);
userRouter.delete("/addresses/delete/:addressId", isAuthenticated, deleteUserAddress);
userRouter.delete("/delete-user/:id", deleteUser);

// Export auth Router
export default userRouter;
