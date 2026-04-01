import { ADMIN_ORDER_QR_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
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
import { CameraView, BarcodeScanningResult, useCameraPermissions } from "expo-camera";
import { orderService } from "@/services/orderService";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";

const AdminOrderQRScan = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const [qrCode, setQrCode] = useState("");
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const getErrorMessage = (error: any, fallback: string) => {
    const message = error?.response?.data?.message || fallback;
    return Array.isArray(message) ? message.join("\n") : message;
  };

  useEffect(() => {
    if (cameraPermission?.granted !== undefined) {
      setHasPermission(cameraPermission.granted);
    }
  }, [cameraPermission]);

  const handleScanOrder = async (code: string) => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      showAlert("Missing QR Code", "Please scan or enter a QR code.");
      return;
    }

    try {
      setLoading(true);
      const order = await orderService.scanOrderVerification(trimmedCode);
      redirectToPage(containers.AdminOrderConfirmationScreen, {
        orderId: order._id,
      });
    } catch (error: any) {
      console.error("Scan order error:", error);
      showAlert("Error", getErrorMessage(error, "Failed to verify order."));
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setShowScanner(false);
    setQrCode(data);
    await handleScanOrder(data);
  };

  const openScanner = async () => {
    try {
      let granted = hasPermission === true;

      if (!granted) {
        const permission = await requestCameraPermission();
        granted = permission.granted;
        setHasPermission(granted);
      }

      if (!granted) {
        showAlert(
          "Camera Permission Required",
          Platform.OS === "web"
            ? "Please allow camera access in your browser to scan QR codes."
            : "Please enable camera access to scan QR codes."
        );
        return;
      }

      setShowScanner(true);
    } catch (error) {
      console.error("Camera permission error:", error);
      showAlert(
        "Camera Permission Required",
        Platform.OS === "web"
          ? "Please allow camera access in your browser to scan QR codes."
          : "Please enable camera access to scan QR codes."
      );
    }
  };

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={ADMIN_ORDER_QR_SCREEN_TITLE} />
  );

  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <AdminFooter activeTab="scan&deliver" />
  );

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isWeb && !isMobileWeb}
      scrollable={true}
      hideNavItems={true}
    >
      <View
        style={[
          styles.contentContainer,
          isWeb && styles.contentContainerWeb,
          isMobileWeb && styles.contentContainerMobileWeb,
        ]}
      >
        <View
          style={[
            styles.card,
            isWeb && styles.cardWeb,
            isMobileWeb && styles.cardMobileWeb,
          ]}
        >
          <View
            style={[
              styles.headerRow,
              isMobileWeb && styles.headerRowMobileWeb,
            ]}
          >
            <View style={styles.headerTextWrap}>
              <Text
                style={[styles.title, isMobileWeb && styles.titleMobileWeb]}
              >
                Scan &amp; Deliver
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  isMobileWeb && styles.subtitleMobileWeb,
                ]}
              >
                Scan the consumer&apos;s order QR code, or enter the QR number
                below.
              </Text>
            </View>
            <View style={styles.headerIconWrap}>
              <MaterialIcons
                name="flashlight-on"
                size={22}
                color={colors.primary}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.scanFrame,
              isMobileWeb && styles.scanFrameMobileWeb,
            ]}
            activeOpacity={0.85}
            onPress={() => {
              void openScanner();
            }}
            disabled={loading}
          >
            <View
              style={[
                styles.scanIconCircle,
                isMobileWeb && styles.scanIconCircleMobileWeb,
              ]}
            >
              <MaterialIcons
                name="qr-code-scanner"
                size={isMobileWeb ? 62 : 72}
                color={colors.primary}
              />
            </View>
            <Text style={styles.scanHint}>Align the QR code within the frame</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View
            style={[
              styles.inputSection,
              isMobileWeb && styles.inputSectionMobileWeb,
            ]}
          >
            <Text style={styles.inputLabel}>Enter QR Number</Text>

            <CustomTextInput
              placeholder="Enter 5-Digit QR Code"
              value={qrCode}
              setValue={setQrCode}
              onPress={() => {}}
              disabled={loading}
            />

            <TouchableOpacity
              style={[
                styles.verifyButton,
                isMobileWeb && styles.verifyButtonMobileWeb,
              ]}
              onPress={() => {
                void handleScanOrder(qrCode);
              }}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={showScanner}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={{ flex: 1, backgroundColor: colors.black }}>
          <CameraView
            onBarcodeScanned={loading ? undefined : handleBarCodeScanned}
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          <TouchableOpacity
            onPress={() => setShowScanner(false)}
            style={{
              position: "absolute",
              top: 56,
              right: 20,
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: colors.white, fontWeight: "600" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {confirmationModal}
    </LayoutComponent>
  );
};

export default AdminOrderQRScan;
