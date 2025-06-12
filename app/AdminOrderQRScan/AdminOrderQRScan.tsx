import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./AdminOrderQRScanStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { globalStyles } from "@/assets/styles/globalStyles";
import AdminFooter from "@/components/AdminFooter";
import PageLayout from "../pageLayoutProps";

const AdminOrderQRScan = () => {
  const [qrCode, setQrCode] = useState("");
  return (
    //   <SafeAreaView style={globalStyles.safeAreaContainer}>
    // <View style={styles.container}>
    //   <Header headerText="Scan QR Code" />
    //   <ScrollView>
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={<Header headerText="Scan QR Code" />}
      footerComponent={<AdminFooter activeTab="scan&deliver" />}
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
    </PageLayout>
  );
};

export default AdminOrderQRScan;
