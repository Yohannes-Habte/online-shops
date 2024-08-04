import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import orderReducer from './reducers/orderReducer';
import sellerReducer from './reducers/sellerReducer';
import productReducer from './reducers/productReducer';
import wishListReducer from './reducers/wishListReducer';
import cartReducer from './reducers/cartReducer';
import eventReducer from './reducers/eventReducer';
import userReducer from './reducers/userReducer';

// Store items in the local storage
const rootReducer = combineReducers({
  user: userReducer,
  order: orderReducer,
  seller: sellerReducer,
  product: productReducer,
  event: eventReducer,
  wishList: wishListReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: 'root',
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
