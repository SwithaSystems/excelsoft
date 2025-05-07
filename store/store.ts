import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cartReducer from "./slices/cartSlice";
import savedItemsReducer from "./slices/savedItemsSlice";
import userReducer from "./slices/userSlice";

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  savedItems: savedItemsReducer,
});

// Configure persistence
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart", "savedItems", "user"],
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
