import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import colors from "@/constants/colors";

type AgeRestrictionBadgeProps = {
  label?: string;
  variant?: "default" | "compact";
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const AgeRestrictionBadge = ({
  label = "Age Restricted",
  variant = "default",
  containerStyle,
  textStyle,
}: AgeRestrictionBadgeProps) => {
  return (
    <View
      style={[
        styles.badge,
        variant === "compact" && styles.badgeCompact,
        containerStyle,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          variant === "compact" && styles.badgeTextCompact,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.ageRestrictionBg,
    borderColor: colors.ageRestrictionBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  badgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  badgeText: {
    color: colors.ageRestrictionText,
    fontSize: 12,
    fontWeight: "700",
  },
  badgeTextCompact: {
    fontSize: 10,
  },
});

export default AgeRestrictionBadge;
