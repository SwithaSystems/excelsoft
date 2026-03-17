import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const FooterWeb = () => {
  const { isMobile, isTablet } = useWebMediaQuery();

  return (
    <View style={[
      styles.footerContainer,
      isMobile && styles.footerContainerMobile,
      isTablet && styles.footerContainerTablet,
    ]}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={() => redirectToPage(containers.homeScreen)}
          activeOpacity={0.7}
          style={Platform.OS === "web" ? { cursor: "pointer" } : undefined}
        >
          <Image
            source={require("@/assets/RecreatedLogo_2.png")}
            style={[
              styles.logo,
              isMobile && styles.logoMobile,
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={[
        styles.middleSection,
        isMobile && styles.middleSectionMobile,
        isTablet && styles.middleSectionTablet,
      ]}>
        <TouchableOpacity
          onPress={() => {
            redirectToPage(containers.homeScreen);
          }}
        >
          <Text style={[
            styles.linkText,
            isMobile && styles.linkTextMobile,
          ]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[
            styles.linkText,
            isMobile && styles.linkTextMobile,
          ]}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            redirectToPage(containers.customerSupportScreen);
          }}
        >
          <Text style={[
            styles.linkText,
            isMobile && styles.linkTextMobile,
          ]}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[
            styles.linkText,
            isMobile && styles.linkTextMobile,
          ]}>Support</Text>
        </TouchableOpacity>
      </View>

      <View style={[
        styles.rightSection,
        isMobile && styles.rightSectionMobile,
      ]}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons 
            name="logo-instagram" 
            size={isMobile ? 20 : 22} 
            color={colors.primary} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons 
            name="logo-linkedin" 
            size={isMobile ? 20 : 22} 
            color={colors.primary} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons 
            name="mail-outline" 
            size={isMobile ? 20 : 22} 
            color={colors.primary} 
          />
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
    paddingVertical: 12,
    width: "100%",
    flexWrap: "wrap",
  },
  footerContainerMobile: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  footerContainerTablet: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 30,
  },
  logoMobile: {
    width: 60,
    height: 24,
  },
  middleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    flex: 1,
  },
  middleSectionMobile: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  middleSectionTablet: {
    gap: 16,
  },
  linkText: {
    fontSize: 14,
    color: "#555",
  },
  linkTextMobile: {
    fontSize: 12,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  rightSectionMobile: {
    gap: 12,
  },
  iconButton: {
    padding: 5,
  },
});

export default FooterWeb;
