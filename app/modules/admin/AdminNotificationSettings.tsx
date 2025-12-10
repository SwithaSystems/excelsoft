import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import colors from "../../../constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { NOTIFICATIONS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import styles from "./AdminnotificationSettingsStyles";

// Define TypeScript interfaces for the settings
interface NotificationOptions {
  orderUpdates: boolean;
  stock: boolean;
  payment: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  options: NotificationOptions;
}

interface SettingsState {
  pushNotifications: NotificationSettings;
  emailNotifications: NotificationSettings;
}

const AdminNotificationSettings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    pushNotifications: {
      enabled: true,
      options: {
        orderUpdates: false,
        stock: false,
        payment: false,
      },
    },
    emailNotifications: {
      enabled: true,
      options: {
        orderUpdates: false,
        stock: false,
        payment: false,
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
        return "New Order Updates";
      case "stock":
        return "Stock Notifications";
      case "payment":
        return "Payment";
      default:
        return key;
    }
  };
  return (
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable
      headerComponent={<Header headerText={NOTIFICATIONS_SCREEN_TITLE} />}
    >
      <View style={[globalStyles.pt_0]}>
        <View>
          <View style={[styles.eachNotificationSection]}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            <Switch
              trackColor={{
                false: colors.placeholdergrey,
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
                    false: colors.placeholdergrey,
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
        <View>
          <View style={[styles.eachNotificationSection]}>
            <Text style={styles.sectionTitle}>Email Notifications</Text>
            <Switch
              trackColor={{
                false: colors.placeholdergrey,
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
                    false: colors.placeholdergrey,
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
    </PageLayout>
  );
};
export default AdminNotificationSettings;
