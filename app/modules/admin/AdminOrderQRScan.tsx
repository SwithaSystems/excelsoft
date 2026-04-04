import { ADMIN_ORDER_QR_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import Header from "../../components/Header";
import colors from "../../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import styles from "./AdminOrderQRScanStyles";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

const AdminOrderQRScan = () => {
  const [qrCode, setQrCode] = useState("");
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting = {true}/>
  ) : (
    <Header headerText={ADMIN_ORDER_QR_SCREEN_TITLE} />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="scan&deliver" />;

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
      hasSidebar={isWeb}
      scrollable={true}
      hideNavItems={true}
    >
      <View style={[styles.contentContainer, isWeb && styles.contentContainerWeb]}>
        <View
          style={[
            styles.card,
            isWeb && styles.cardWeb,
            isMobileWeb && styles.cardMobileWeb,
          ]}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Scan &amp; Deliver</Text>
              <Text style={styles.subtitle}>
                Scan the consumer&apos;s order QR code, or enter the QR number below.
              </Text>
            </View>
            <View style={styles.headerIconWrap}>
              <MaterialIcons name="flashlight-on" size={22} color={colors.primary} />
            </View>
          </View>

          <View style={styles.scanFrame}>
            <View style={styles.scanIconCircle}>
              <MaterialIcons
                name="qr-code-scanner"
                size={isMobileWeb ? 62 : 72}
                color={colors.primary}
              />
            </View>
            <Text style={styles.scanHint}>Align the QR code within the frame</Text>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Enter QR Number</Text>

            <CustomTextInput
              placeholder="Enter 5-Digit QR Code"
              value={qrCode}
              setValue={setQrCode}
              onPress={() => {}}
            />

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => {}}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </ScrollView>
  </View>
  <AdminFooter activeTab="scan&deliver"/>
</SafeAreaView> */}
    </LayoutComponent>
  );
};

export default AdminOrderQRScan;
