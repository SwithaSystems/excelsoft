// // This is a shim for web and Android where the tab bar is generally opaque.
// export default undefined;

// export function useBottomTabOverflow() {
//   return 0;
// }

import { Platform } from "react-native";
 
export function useBottomTabOverflow() {
  if (Platform.OS === "ios") {
    const { useBottomTabBarHeight } = require("@react-navigation/bottom-tabs");
    const { useSafeAreaInsets } = require("react-native-safe-area-context");
 
    const tabHeight = useBottomTabBarHeight();
    const { bottom } = useSafeAreaInsets();
    return tabHeight - bottom;
  }
  return 0;
}