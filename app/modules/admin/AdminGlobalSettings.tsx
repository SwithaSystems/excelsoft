import React, { useState, useEffect } from "react";
import { View, Text, Switch, ActivityIndicator, Alert, TextInput, TouchableOpacity } from "react-native";

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
  key: keyof Omit<GlobalSettingsDto, "updatedAt">;
  label: string;
  description: string;
  type?: "switch" | "input";
}

const SETTINGS_CONFIG: SettingConfig[] = [
  {
    key: "displayCarousel",
    label: "Display Carousel",
    description:
      "Toggle to show or hide dynamic content carousels across the app, such as promotions or featured items.",
    type: "switch",
  },
  {
    key: "timeWindow",
    label: "Time Window",
    description:
      "Add two hours default period to deliver the package once the user placed the order.",
    type: "switch",
  },
  {
    key: "deliveryMode",
    label: "Delivery Mode",
    description:
      "Allow customers to place delivery orders when enabled. Turn off to stop accepting deliveries.",
    type: "switch",
  },
  {
    key: "shippingCharge",
    label: "Shipping Charge",
    description: "Default delivery charge applied to all delivery orders.",
    type: "input",
  },
];

const AdminGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSettingsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [tempShippingValue, setTempShippingValue] = useState("");

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

  const handleEditShipping = () => {
    if (settings) {
      setTempShippingValue(String(settings.shippingCharge ?? ""));
      setIsEditingShipping(true);
    }
  };

  const handleSaveShipping = async () => {
    if (!settings) return;

    const numericValue = parseFloat(tempShippingValue);

    if (isNaN(numericValue) || numericValue < 0) {
      Alert.alert("Invalid value", "Please enter a valid shipping charge.");
      return;
    }

    setUpdatingKey("shippingCharge");

    // Optimistic update
    setSettings((prev) =>
      prev ? { ...prev, shippingCharge: numericValue } : prev
    );

    try {
      // Ensure we're sending a number, not a string
      await globalSettingsAPI.updateSettings("shippingCharge", numericValue);
      setIsEditingShipping(false);
    } catch (error) {
      console.error("Failed to update shippingCharge:", error);
      Alert.alert("Error", "Failed to update shipping charge.");
      fetchSettings();
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingShipping(false);
    setTempShippingValue("");
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

              {config.type === "switch" ? (
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
                    value={Boolean(settings[config.key])}
                    onValueChange={() => handleToggle(config.key)}
                    disabled={updatingKey !== null}
                  />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditingShipping && styles.inputReadOnly,
                    ]}
                    keyboardType="numeric"
                    value={
                      isEditingShipping
                        ? tempShippingValue
                        : String(settings.shippingCharge ?? "0")
                    }
                    onChangeText={setTempShippingValue}
                    editable={isEditingShipping}
                    placeholder="Enter amount"
                  />
                  
                  {!isEditingShipping ? (
                    <TouchableOpacity
                      onPress={handleEditShipping}
                      style={styles.editButton}
                      disabled={updatingKey !== null}
                    >
                      <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.actionButtons}>
                      {updatingKey === "shippingCharge" ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <>
                          <TouchableOpacity
                            onPress={handleSaveShipping}
                            style={styles.saveButton}
                          >
                            <Text style={styles.saveIcon}>✓</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleCancelEdit}
                            style={styles.cancelButton}
                          >
                            <Text style={styles.cancelIcon}>✕</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>

            <Text style={styles.switchDescription}>
              {config.description}
            </Text>
          </View>
        ))}
      </View>
    </PageLayout>
  );
};

export default AdminGlobalSettings;