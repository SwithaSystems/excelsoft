import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

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
      <View style={styles.card}>
        {/* Avatar & greeting */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons
              name="person-circle-outline"
              size={80}
              color={colors.primary}
            />
          </View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Biometric section */}
        {isBiometricSupported && isEnrolled ? (
          <>
            <View style={styles.biometricPrompt}>
              <View style={styles.biometricIconCircle}>
                <Ionicons
                  name="lock-closed-outline"
                  size={40}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.promptTitle}>
                Secure Access
              </Text>
              <Text style={styles.promptSubtitle}>
                Use your device lock to sign in quickly and securely
              </Text>
            </View>

            <TouchableOpacity
              style={styles.authButton}
              onPress={handleBiometricAuth}
              activeOpacity={0.85}
            >
              <Ionicons
                name="lock-open-outline"
                size={24}
                color={colors.white}
              />
              <Text style={styles.authButtonText}>
                Unlock
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.infoTitle}>Device lock not available</Text>
            <Text style={styles.infoText}>
              Set up a screen lock in your device settings to use quick sign-in.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BiometricAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  biometricPrompt: {
    alignItems: "center",
    marginBottom: 24,
  },
  biometricIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 6,
  },
  promptSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.white,
  },
  infoCard: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(13, 123, 75, 0.15)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginTop: 10,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 20,
  },
});
