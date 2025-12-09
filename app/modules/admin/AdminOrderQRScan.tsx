import { ADMIN_ORDER_QR_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  useWindowDimensions,
} from "react-native";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { globalStyles } from "@/assets/styles/globalStyles";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import styles from "./AdminOrderQRScanStyles";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

const AdminOrderQRScan = () => {
  const [qrCode, setQrCode] = useState("");
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb hideUserGreeting = {true}/>
  ) : (
    <Header headerText={ADMIN_ORDER_QR_SCREEN_TITLE} />
  );

  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <AdminFooter activeTab="scan&deliver" />;

  return (
    //   <SafeAreaView style={globalStyles.safeAreaContainer}>
    // <View style={styles.container}>
    //   <Header headerText={ADMIN_ORDER_QR_SCREEN_TITLE} />
    //   <ScrollView>
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isTabOrDesktop}
      scrollable={isTabOrDesktop ? false : true}
      hideNavItems={true}
    >
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Scan the consumer's QR Order</Text>
        <MaterialIcons name="flashlight-on" size={24} color={colors.primary} />
      </View>

      <MaterialIcons
        name="qr-code-scanner"
        size={196}
        color={colors.primary}
        style={styles.qrIcon}
      />

      <Text style={styles.orText}>OR</Text>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Enter QR Number</Text>

        <CustomTextInput
          placeholder="Enter 5-Digit QR Code"
          value={qrCode}
          setValue={setQrCode}
          onPress={() => {}}
        />

        <TouchableOpacity style={styles.verifyButton} onPress={() => {}}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
      {/* </ScrollView>
  </View>
  <AdminFooter activeTab="scan&deliver"/>
</SafeAreaView> */}
    </LayoutComponent>
  );
};

export default AdminOrderQRScan;
