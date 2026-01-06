import React from "react";
import { TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../constants/colors";
import { useNavigation } from "expo-router";
import { clearNavigationStack } from "@/utilities/redirectionHelper";

interface BackArrowProps {
  needResetNavigation?: boolean;
}

const BackArrow = ({ needResetNavigation }: BackArrowProps) => {
  const router = useRouter();
  const navigation = useNavigation();
  // const { width } = useWindowDimensions();
  // const isMobile = width < 768;
  const isWeb = Platform.OS === "web";
  
  
  // Hide on tablet and desktop
  if (isWeb) {
    return null;
  }
  
  const handleBackArrow = () => {
    if (needResetNavigation) {
      clearNavigationStack("modules/home/Home");
    } else {
      navigation.goBack();
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      // onPress={() => router.canGoBack() ? router.back() : router.replace({
      //     pathname: "/",
      //   })}
      onPress={handleBackArrow}
    >
      <Ionicons name="arrow-back" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    alignItems: "center",
  },
});

export default BackArrow;
