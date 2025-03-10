import express from "express";
import {
  createShop,
  deleteAllShops,
  deleteSingleShop,
  deleteWithdrawMethod,
  getAllShops,
  getShop,
  getShopInfo,
  getShopProducts,
  loginSeller,
  resetForgotShopPassword,
  sellerLogout,
  shopForgotPassword,
  updatePaymentMethods,
  updateShopProfile,
} from "../controllers/shopController.js";
import requiredValues from "../validators/requiredValues.js";
import shopRegisterValidator from "../validators/shopRegisterValidator.js";
import checkValidation from "../validators/checkValidation.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

// shop Router
const shopRouter = express.Router();

// shop routes
shopRouter.post(
  "/create",
  requiredValues([
    "name",
    "email",
    "password",
    "phoneNumber",
    "description",
    "shopAddress",
    "LogoImage",
    "agree",
  ]),
  shopRegisterValidator(),
  checkValidation,
  createShop
);
shopRouter.post("/login",  loginSeller);
shopRouter.get("/shop", isSellerAuthenticated, getShop);
shopRouter.put("/update", updateShopProfile);
shopRouter.get("/logout", sellerLogout);
shopRouter.delete("/delete", deleteSingleShop);
shopRouter.delete("/payment-method/:id", deleteWithdrawMethod);
shopRouter.get("/", getAllShops);
shopRouter.get("/shop/products", isSellerAuthenticated, getShopProducts);
shopRouter.get("/get-shop-info/:id", isSellerAuthenticated, getShopInfo);
shopRouter.post("/forgotPassword", shopForgotPassword);
shopRouter.patch("/shop-reset-password/:token", resetForgotShopPassword);
shopRouter.put("/update-payment-methods", updatePaymentMethods);


shopRouter.delete("/delete-all-shops", deleteAllShops);

// Export shop Router
export default shopRouter;
