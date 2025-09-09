import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secureStore } from "./secureStore";
import cartReducer from "./slices/cartSlice";
import savedItemsReducer from "./slices/savedItemsSlice";
import userReducer from "./slices/userSlice";
import savedForLaterReducer from "./slices/savedForLaterSlice";

const userPErsistConfig = {
  key: "user",
  storage: secureStore,
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  savedItems: savedItemsReducer,
  savedForLaterItems: savedForLaterReducer,
});

// Configure persistence
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart", "savedItems", "savedforLaterItems"],
};

// Apply persistReducer to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
