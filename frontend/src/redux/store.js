import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./reducers/orderReducer";
import sellerReducer from "./reducers/sellerReducer";
import productReducer from "./reducers/productReducer";
import wishListReducer from "./reducers/wishListReducer";
import cartReducer from "./reducers/cartReducer";
import eventReducer from "./reducers/eventReducer";
import userReducer from "./reducers/userReducer";

// create Sore variable
const Store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
    seller: sellerReducer,
    product: productReducer,
    event: eventReducer,
    wishList: wishListReducer,
    cart: cartReducer,
  },
});

export default Store;
