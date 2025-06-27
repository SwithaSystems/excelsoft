import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "../pageLayoutProps";
import Header from "@/components/Header";

const BiometricSettingsScreen = ({ navigation }: any) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    checkBiometricSupport();
    loadBiometricSettings();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          setIsBiometricSupported(false);
          return;
        }

        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType("Face ID");
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType("Fingerprint");
        } else {
          setBiometricType("Biometric");
        }
      }
    } catch (error) {
      console.error("Error checking biometric support:", error);
      setIsBiometricSupported(false);
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
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${biometricType} for app access`,
      });

      if (result.success) {
        await SecureStore.setItemAsync("biometric_enabled", "true");
        setIsBiometricEnabled(true);
        Alert.alert("Success", `${biometricType} has been enabled.`);
      } else {
        Alert.alert("Failed", "Authentication was not successful.");
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
          <Text>Loading...</Text>
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
              {biometricType} Authentication
            </Text>
            <Text style={styles.settingDescription}>
              {isBiometricSupported
                ? `Use ${biometricType} to quickly and securely access your account`
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

        {isBiometricEnabled && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ✓ {biometricType} authentication is enabled. You'll be prompted to
              authenticate when opening the app.
            </Text>
          </View>
        )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    fontSize: 16,
    color: "#007AFF",
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: "#e8f5e8",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#2d6a2d",
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
});

export default BiometricSettingsScreen;
