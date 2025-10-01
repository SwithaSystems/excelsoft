// import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
// import { PlatformPressable } from "@react-navigation/elements";
// import * as Haptics from "expo-haptics";

const { BottomTabBarButtonProps } = require("@react-navigation/bottom-tabs");
const { PlatformPressable } = require("@react-navigation/elements");
const Haptics = require("expo-haptics");

export function HapticTab(props: typeof BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev: any) => {
        if (process.env.EXPO_OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
export default HapticTab;
