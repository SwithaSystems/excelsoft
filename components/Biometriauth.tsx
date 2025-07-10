import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

interface BiometricAuthProps {
  onAuthSuccess: (token: string) => void;
  onAuthFailure: (error: string) => void;
  // onLogout?: () => void;
  userName?: string;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onAuthSuccess,
  onAuthFailure,
  // onLogout,
  userName = "User",
}) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState("Biometric");
  const [isEnrolled, setIsEnrolled] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);
  // useEffect(() => {
  //   const checkExistingToken = async () => {
  //     const token = await SecureStore.getItemAsync("biometric_auth_token");
  //     if (token) {
  //       onAuthSuccess(token);
  //     }
  //   };
  //   checkExistingToken();
  // }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (!compatible) return;

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsEnrolled(enrolled);

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
      }
    } catch (error) {
      console.error("Biometric check error:", error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      // if (isAuthenticated) return;
      if (!isBiometricSupported || !isEnrolled) {
        Alert.alert("Error", "Biometric auth not available");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        // promptMessage: `Authenticate as ${userName}`,
        promptMessage: `Login to Weekes`,
        cancelLabel: "Cancel",
        fallbackLabel: "Use Pattern",
        disableDeviceFallback: false,
      });

      if (result.success) {
        const token = await generateAuthToken();
        await SecureStore.setItemAsync("biometric_auth_token", token);
        onAuthSuccess(token);
        // setIsAuthenticated(true);
      } else {
        onAuthFailure(result.error || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Biometric auth error:", error);
      onAuthFailure(error.message || "Unknown error");
    }
  };

  const generateAuthToken = async (): Promise<string> => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `bio_${timestamp}_${random}`;
  };

  const clearBiometricData = async () => {
    await SecureStore.deleteItemAsync("biometric_auth_token");
    Alert.alert("Cleared", "Biometric data removed");
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      {/* <View style={styles.topBar}>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View> */}

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#aaa" />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Biometric Auth Button */}
      {isBiometricSupported && isEnrolled ? (
        <TouchableOpacity
          style={styles.authButton}
          onPress={handleBiometricAuth}
        >
          <Ionicons name="finger-print-outline" size={28} color="#007AFF" />
          <Text style={styles.authButtonText}>Quick Secure Access</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoText}>
          Please set up biometric authentication in your device settings.
        </Text>
      )}

      {/* Branding */}
      {/* <View style={styles.footer}>
        <Text style={styles.branding}>ExcelSoft</Text>
        <TouchableOpacity onPress={clearBiometricData}>
          <Text style={styles.clearText}>Clear Biometric Data</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default BiometricAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  topBar: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  // logoutText: {
  //   fontSize: 16,
  //   color: "#007AFF",
  // },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  userName: {
    fontSize: 16,
    marginTop: 10,
    color: "#444",
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#007AFF",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: 40,
  },
  authButtonText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 10,
  },
  infoText: {
    textAlign: "center",
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    alignItems: "center",
  },
  branding: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 8,
  },
  clearText: {
    fontSize: 13,
    color: "#FF3B30",
  },
});
