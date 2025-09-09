import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { ImageSourcePropType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  console.log("image selected", image, typeof image);
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <Image
        source={
          image && typeof image === "string" && image === ""
            ? { uri: image }
            : typeof image === "object" && image
            ? image
            : require("../../assets/Placeholder.png")
        }
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "80%",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    textAlign: "center",
    paddingVertical: 8,
    backgroundColor: colors.secondary,
  },
});

export default CategoryItem;
