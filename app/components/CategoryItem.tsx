import React, { useState } from "react";
import { TouchableOpacity, Text, Image, StyleSheet, Platform, View } from "react-native";
import colors from "../../constants/colors";
import { ImageSourcePropType } from "react-native";
interface CategoryItemProps {
  title: string;
  image: ImageSourcePropType;
  onPress: () => void;
  containerStyle?: {};
}

const CategoryItem = ({
  title,
  image,
  onPress,
  containerStyle,
}: CategoryItemProps) => {
  const [hovered, setHovered] = useState(false);
  const isWeb = Platform.OS === "web";

  return (
    <View
      onMouseEnter={() => isWeb && setHovered(true)}
      onMouseLeave={() => isWeb && setHovered(false)}
      style={[styles.wrapper, hovered && isWeb && styles.wrapperHovered]}
    >
      <TouchableOpacity
        style={[
          styles.container,
          containerStyle,
          hovered && isWeb && styles.containerHovered,
        ]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image
          source={
            typeof image === "string" && image !== ""
              ? { uri: image }
              : typeof image === "object" && image
              ? image
              : require("../../assets/Placeholder.png")
          }
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  wrapperHovered: {
    transform: [{ translateY: -4 }],
  },
  container: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.white,
    marginBottom: 20,
    ...(Platform.OS === "web"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }
      : {}),
  },
  containerHovered: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "76%",
  },
  titleWrapper: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
  },
});

export default CategoryItem;
