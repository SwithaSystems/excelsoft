import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  Alert,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "../../pageLayoutProps";
import Header from "../../components/Header";
import styles from "./BiometricSettingsStyles";

const BiometricSettingsScreen = ({ navigation }: any) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    checkBiometricSupport();
    loadBiometricSettings();
  }, []);

  const checkBiometricSupport = async () => {
    let detectedType = "Biometric";

    console.log(" Checking biometric support...");
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      console.log(" Hardware compatible:", compatible);

      if (!compatible) {
        setIsBiometricSupported(false);
        setDebugInfo("Hardware not compatible");
        return;
      }

      if (compatible) {
        // Check if biometrics are enrolled
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        console.log("👆 Biometrics enrolled:", enrolled);

        if (!enrolled) {
          setIsBiometricSupported(false);
          setDebugInfo("No biometrics enrolled");
          return;
        }
        if (!enrolled) {
          setIsBiometricSupported(false);
          return;
        }

        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        console.log("supported types", types);
        if (Platform.OS === "ios") {
          if (
            types.includes(
              LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            )
          ) {
            detectedType = "Face ID";
          } else if (
            types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
          ) {
            detectedType = "Touch ID";
          } else {
            detectedType = "Biometric";
          }
        } else {
          if (
            types.includes(
              LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            )
          ) {
            detectedType = "Face Recognition";
          } else if (
            types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
          ) {
            detectedType = "Fingerprint";
          }
        }
        setBiometricType(detectedType);
        setIsBiometricSupported(true);
        setDebugInfo(`${detectedType} available`);
      }
    } catch (error) {
      setBiometricType(detectedType);
      setIsBiometricSupported(true);
      setDebugInfo(`${detectedType} available`);
    }
  };

  const loadBiometricSettings = async () => {
    try {
      const enabled = await SecureStore.getItemAsync("biometric_enabled");
      setIsBiometricEnabled(enabled === "true");
    } catch (error) {
      console.error("Error loading biometric settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBiometricAuth = async (value: any) => {
    if (value) {
      // Enabling biometric auth - require authentication first
      await enableBiometricAuth();
    } else {
      // Disabling biometric auth
      await disableBiometricAuth();
    }
  };

  const enableBiometricAuth = async () => {
    console.log(" Starting biometric authentication...");
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${biometricType} for secure app access`,
        disableDeviceFallback: false,
        fallbackLabel: "Use Password",
      });

      console.log("Authentication result:", result);

      if (result.success) {
        await SecureStore.setItemAsync("biometric_enabled", "true");
        setIsBiometricEnabled(true);
        Alert.alert("Success", `${biometricType} has been enabled.`);
      } else {
        if (result.error === "user_cancel") {
          console.log("User cancelled the authentication");
        } else if (result.error === "user_fallback") {
          console.log("User chose to use passcode");
        } else if (result.error === "system_cancel") {
          console.log("System cancelled authentication");
        } else {
          console.log(" Authentication failed:", result.error);
        }
        Alert.alert(
          "Authentication Failed",
          `${biometricType} authentication was not successful. Please try again.`
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not enable biometric auth.");
    }
  };

  const disableBiometricAuth = async () => {
    Alert.alert(
      "Disable Biometric Authentication",
      `Are you sure you want to disable ${biometricType}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync("biometric_enabled");
            setIsBiometricEnabled(false);
            Alert.alert("Disabled", `${biometricType} has been turned off.`);
          },
        },
      ]
    );
  };

  // Test biometric authentication function
  const testBiometricAuth = async () => {
    try {
      console.log("Testing biometric authentication...");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Test ${biometricType} Authentication`,
        disableDeviceFallback: false,
        fallbackLabel: "Use Passcode",
      });

      console.log("Test result:", result);

      if (result.success) {
        Alert.alert(
          "Success",
          `${biometricType} authentication works correctly!`
        );
      } else {
        Alert.alert(
          "Test Failed",
          `${biometricType} authentication test failed: ${result.error}`
        );
      }
    } catch (error: any) {
      console.error("Test error:", error);
      Alert.alert("Error", `Test failed: ${error.message}`);
    }
  };

  // const registerDeviceForBiometric = async () => {
  //   try {
  //     let deviceId = await SecureStore.getItemAsync("device_id");
  //     if (!deviceId) {
  //       deviceId =
  //         Date.now().toString() + Math.random().toString(36).substring(2);
  //       await SecureStore.setItemAsync("device_id", deviceId);
  //     }

  //     const response = await fetch(
  //       "YOUR_BACKEND_URL/api/auth/register-device",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user?.token}`,
  //         },
  //         body: JSON.stringify({
  //           deviceId,
  //           deviceName: biometricType + " Device",
  //           userId: user?.id,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to register device");
  //     }
  //   } catch (error) {
  //     console.error("Error registering device:", error);
  //     throw error;
  //   }
  // };

  // const unregisterDeviceFromBiometric = async () => {
  //   try {
  //     const deviceId = await SecureStore.getItemAsync("device_id");
  //     if (!deviceId) return;

  //     const response = await fetch(
  //       `YOUR_BACKEND_URL/api/auth/unregister-device`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user?.token}`,
  //         },
  //         body: JSON.stringify({
  //           deviceId,
  //           userId: user?.id,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       console.error("Failed to unregister device from backend");
  //     }
  //   } catch (error) {
  //     console.error("Error unregistering device:", error);
  //   }
  // };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading biometric settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <PageLayout
      scrollable={false}
      hasHeader
      hasFooter={false}
      headerComponent={<Header headerText="Security Settings" />}
    >
      <View style={styles.content}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>
              {/* {biometricType} Authentication */}
              Biometric authenticatin
            </Text>
            <Text style={styles.settingDescription}>
              {isBiometricSupported
                ? `Use biometrics to quickly and securely access your account`
                : `${biometricType} is not available on this device`}
            </Text>
          </View>
          <Switch
            value={isBiometricEnabled}
            onValueChange={toggleBiometricAuth}
            disabled={!isBiometricSupported}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isBiometricEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* Debug Information - Remove in production */}
        {/* <View style={styles.debugBox}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
          <Text style={styles.debugText}>Status: {debugInfo}</Text>
          <Text style={styles.debugText}>
            Supported: {isBiometricSupported ? "Yes" : "No"}
          </Text>
          <Text style={styles.debugText}>
            Enabled: {isBiometricEnabled ? "Yes" : "No"}
          </Text>
        </View> */}

        {/* {isBiometricEnabled && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText} onPress={testBiometricAuth}>
              ✓ {biometricType} authentication is enabled. You'll be prompted to
              authenticate when opening the app.
            </Text>
          </View>
        )} */}

        {!isBiometricSupported && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              {biometricType} authentication is not available on this device.
              Please ensure it's set up in your device settings.
            </Text>
          </View>
        )}
      </View>
    </PageLayout>
  );
};

export default BiometricSettingsScreen;
