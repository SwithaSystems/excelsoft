import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import colors from "../config/colors";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect } from "react";
import { Alert } from "react-native";


// Define TypeScript interfaces for the settings
interface NotificationOptions {
  orderUpdates: boolean;
  promotions: boolean;
  recommendations: boolean;
  backInStock: boolean;
  newArrivals: boolean;
  priceDrops: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  options: NotificationOptions;
}

interface SettingsState {
  pushNotifications: NotificationSettings;
  emailNotifications: NotificationSettings;
}

const notificationsScreen: React.FC = () => {
  // Initial state with default values
  const [settings, setSettings] = useState<SettingsState>({
    pushNotifications: {
      enabled: true,
      options: {
        orderUpdates: false,
        promotions: false,
        recommendations: false,
        backInStock: false,
        newArrivals: false,
        priceDrops: false,
      },
    },
    emailNotifications: {
      enabled: true,
      options: {
        orderUpdates: false,
        promotions: false,
        recommendations: false,
        backInStock: false,
        newArrivals: false,
        priceDrops: false,
      },
    },
  });

  // Function to toggle category (Push or Email Notifications)
  const toggleCategory = (category: keyof SettingsState) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        enabled: !prevSettings[category].enabled,
      },
    }));
  };

  // Function to toggle individual options within a category
  const toggleOption = (
    category: keyof SettingsState,
    option: keyof NotificationOptions
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        options: {
          ...prevSettings[category].options,
          [option]: !prevSettings[category].options[option],
        },
      },
    }));
  };

  // Helper function to format option labels
  const formatOptionLabel = (key: string): string => {
    switch (key) {
      case "orderUpdates":
        return "Order Updates";
      case "promotions":
        return "Promotions and Deals";
      case "recommendations":
        return "Recommendations";
      case "backInStock":
        return "Back in stock";
      case "newArrivals":
        return "New Arrivals";
      case "priceDrops":
        return "Price Drops";
      default:
        return key;
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={globalStyles.container}>
      <Header headerText="Notification Settings" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <View style={[globalStyles.mb_2]}>
            <View style={[globalStyles.mb_2, styles.eachNotificationSection]}>
              <Text style={styles.sectionTitle}>Push Notifications</Text>
              <Switch
                trackColor={{
                  false: colors.switchTrackOff,
                  true: colors.primary,
                }}
                thumbColor={colors.white}
                value={settings.pushNotifications.enabled}
                onValueChange={() => toggleCategory("pushNotifications")}
              />
            </View>
            {settings.pushNotifications.enabled &&
              (
                Object.keys(settings.pushNotifications.options) as Array<
                  keyof NotificationOptions
                >
              ).map((optionKey) => (
                <View style={styles.switchContainer} key={optionKey}>
                  <Text style={styles.switchLabel}>
                    {formatOptionLabel(optionKey)}
                  </Text>
                  <Switch
                    trackColor={{
                      false: colors.switchTrackOff,
                      true: colors.primary,
                    }}
                    thumbColor={colors.white}
                    value={settings.pushNotifications.options[optionKey]}
                    onValueChange={() =>
                      toggleOption("pushNotifications", optionKey)
                    }
                  />
                </View>
              ))}
          </View>

          {/* Email Notifications */}
          <View style={[globalStyles.mb_2]}>
            <View style={[globalStyles.mb_2, styles.eachNotificationSection]}>
              <Text style={styles.sectionTitle}>Email Notifications</Text>
              <Switch
                trackColor={{
                  false: colors.switchTrackOff,
                  true: colors.primary,
                }}
                thumbColor={colors.white}
                value={settings.emailNotifications.enabled}
                onValueChange={() => toggleCategory("emailNotifications")}
              />
            </View>
            {settings.emailNotifications.enabled &&
              (
                Object.keys(settings.emailNotifications.options) as Array<
                  keyof NotificationOptions
                >
              ).map((optionKey) => (
                <View style={styles.switchContainer} key={optionKey}>
                  <Text style={styles.switchLabel}>
                    {formatOptionLabel(optionKey)}
                  </Text>
                  <Switch
                    trackColor={{
                      false: colors.switchTrackOff,
                      true: colors.primary,
                    }}
                    thumbColor={colors.white}
                    value={settings.emailNotifications.options[optionKey]}
                    onValueChange={() =>
                      toggleOption("emailNotifications", optionKey)
                    }
                  />
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  backText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  eachNotificationSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
});

export default notificationsScreen;
