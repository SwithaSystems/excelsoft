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
import {
  AGE_RESTRICTION_NOTE_MESSAGE,
  AGE_RESTRICTION_PRODUCT_NOTE_MESSAGE,
} from "@/utilities/ageRestriction";

export { AGE_RESTRICTION_NOTE_MESSAGE, AGE_RESTRICTION_PRODUCT_NOTE_MESSAGE };

type AgeRestrictionNoteProps = {
  title?: string;
  message?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
};

const AgeRestrictionNote = ({
  title = "Age-Restricted Items in Cart",
  message = AGE_RESTRICTION_NOTE_MESSAGE,
  containerStyle,
  titleStyle,
  messageStyle,
}: AgeRestrictionNoteProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.message, messageStyle]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ageRestrictionBg,
    borderColor: colors.ageRestrictionBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  title: {
    color: colors.ageRestrictionText,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  message: {
    color: colors.ageRestrictionText,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default AgeRestrictionNote;
