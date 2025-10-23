// utilities/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local") 
    : AsyncStorage;

export default storage;