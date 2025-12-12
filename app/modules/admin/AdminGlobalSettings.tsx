import React, { useState, useEffect } from "react";
import { View, Text, Switch, ActivityIndicator, Alert } from "react-native";
import styles from "./AdminGlobalSettingsStyles";
import colors from "@/constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Header from "@/app/components/Header";
import { GLOOBAL_SETTINGS_SCREEN_TITLE } from "@/constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import globalSettingsAPI, {
  GlobalSettingsDto,
} from "@/services/globalSettingsService";

interface SettingConfig {
  key: keyof Omit<GlobalSettingsDto, "updatedAt">; // Exclude updatedAt
  label: string;
  description: string;
}

const SETTINGS_CONFIG: SettingConfig[] = [
  {
    key: "displayCarousel",
    label: "Display Carousel",
    description:
      "Toggle to show or hide dynamic content carousels across the app, such as promotions or featured items.",
  },
  {
    key: "timeWindow",
    label: "Time Window",
    description:
      "Add two hours default period to deliver the package once the user placed the order.",
  },
  {
    key: "deliveryMode",
    label: "Delivery Mode",
    description:
      "Allow customers to place delivery orders when enabled. Turn off to stop accepting deliveries.",
  },
];

const AdminGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSettingsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await globalSettingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      Alert.alert("Error", "Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (
    key: keyof Omit<GlobalSettingsDto, "updatedAt">
  ) => {
    if (!settings) return;

    const newValue = !settings[key];
    setUpdatingKey(key);

    // Optimistic update
    setSettings((prev) => (prev ? { ...prev, [key]: newValue } : prev));

    try {
      await globalSettingsAPI.updateSettings(key, newValue);
      // console.log(`${key} updated to ${newValue}`);
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      // Revert on error
      setSettings((prev) => (prev ? { ...prev, [key]: !newValue } : prev));
      Alert.alert("Error", `Failed to update ${key}. Please try again.`);
    } finally {
      setUpdatingKey(null);
    }
  };

  if (loading) {
    return (
      <PageLayout
        hasFooter={false}
        hasHeader
        scrollable
        headerComponent={<Header headerText={GLOOBAL_SETTINGS_SCREEN_TITLE} />}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </PageLayout>
    );
  }

  if (!settings) {
    return (
      <PageLayout
        hasFooter={false}
        hasHeader
        scrollable
        headerComponent={<Header headerText={GLOOBAL_SETTINGS_SCREEN_TITLE} />}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load settings</Text>
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable
      headerComponent={<Header headerText={GLOOBAL_SETTINGS_SCREEN_TITLE} />}
    >
      <View style={[globalStyles.pt_0]}>
        {SETTINGS_CONFIG.map((config) => (
          <View key={config.key}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{config.label}</Text>
              <View style={styles.switchWrapper}>
                {updatingKey === config.key && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.switchLoader}
                  />
                )}
                <Switch
                  trackColor={{
                    false: colors.placeholdergrey,
                    true: colors.primary,
                  }}
                  thumbColor={colors.white}
                  value={Boolean(settings[config.key])} // Ensure it's always a boolean
                  onValueChange={() => handleToggle(config.key)}
                  disabled={updatingKey !== null}
                />
              </View>
            </View>
            <View>
              <Text style={styles.switchDescription}>{config.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </PageLayout>
  );
};

export default AdminGlobalSettings;
