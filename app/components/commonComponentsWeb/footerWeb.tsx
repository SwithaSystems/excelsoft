import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

const FooterWeb = () => {
  const isWeb = Platform.OS === "web";
  const { width } = useWindowDimensions();

  const isWebSmallScreen = isWeb && width < 900;

  return (
    <View
      style={[
        styles.footerContainer,
        isWebSmallScreen && styles.footerContainerTablet,
      ]}
    >
      <View style={styles.leftSection}>
        <Image
          source={require("@/assets/RecreatedLogo_2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View
        style={[
          styles.middleSection,
          isWebSmallScreen && styles.middleSectionTablet,
        ]}
      >
        <TouchableOpacity>
          <Text style={styles.linkText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>Support</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="logo-instagram" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="logo-linkedin" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mail-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 10,
  },

  footerContainerTablet: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 80,
    height: 30,
  },

  middleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  middleSectionTablet: {
    flexWrap: "wrap",
    justifyContent: "center",
  },

  linkText: {
    fontSize: 14,
    color: "#555",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  iconButton: {
    padding: 5,
  },
});

export default FooterWeb;
