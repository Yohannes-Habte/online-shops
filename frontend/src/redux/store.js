import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sellerReducer from "./reducers/sellerReducer";
import wishListReducer from "./reducers/wishListReducer";
import cartReducer from "./reducers/cartReducer";
import eventReducer from "./reducers/eventReducer";
import userReducer from "./reducers/userReducer";
import productReducer from "./reducers/productReducer";
import orderReducer from "./reducers/orderReducer";





// Store items in the local storage
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  order: orderReducer,
  seller: sellerReducer,
  event: eventReducer,
  wishList: wishListReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Create a Persist Reducer variable
const persistedReducer = persistReducer(persistConfig, rootReducer);

// create Sore variable
export const Store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export persistor
export const persistor = persistStore(Store);

// const Store = configureStore({
//   reducer: {
//     user: userReducer,
//     order: orderReducer,
//     seller: sellerReducer,
//     product: productReducer,
//     event: eventReducer,
//     wishList: wishListReducer,
//     cart: cartReducer,
//   },
// });

// export default Store;
