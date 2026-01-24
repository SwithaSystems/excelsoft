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
  {
    key: "minimumOrderValue",
    label: "Minimum Order Value",
    description: "Minimum order value required for customers to place an order.",
    type: "input",
  },
  {
    key: "minimumCheckoutOrderValue",
    label: "Minimum Checkout Order Value",
    description: "Minimum order value required to proceed to checkout.",
    type: "input",
  },
];

const AdminGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSettingsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  
  // Track editing state for each input field
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({
    shippingCharge: "",
    minimumOrderValue: "",
    minimumCheckoutOrderValue: "",
  });

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

  const handleEditField = (fieldKey: string) => {
    if (settings) {
      setTempValues((prev) => ({
        ...prev,
        [fieldKey]: String(settings[fieldKey as keyof GlobalSettingsDto] ?? ""),
      }));
      setEditingField(fieldKey);
    }
  };

  const handleSaveField = async (fieldKey: string) => {
    if (!settings) return;

    const numericValue = parseFloat(tempValues[fieldKey]);

    if (isNaN(numericValue) || numericValue < 0) {
      Alert.alert("Invalid value", `Please enter a valid ${fieldKey.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
      return;
    }

    setUpdatingKey(fieldKey);

    // Optimistic update
    setSettings((prev) =>
      prev ? { ...prev, [fieldKey]: numericValue } : prev
    );

    try {
      await globalSettingsAPI.updateSettings(fieldKey as keyof Omit<GlobalSettingsDto, "updatedAt">, numericValue);
      setEditingField(null);
    } catch (error) {
      console.error(`Failed to update ${fieldKey}:`, error);
      Alert.alert("Error", `Failed to update ${fieldKey.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
      fetchSettings();
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValues({
      shippingCharge: "",
      minimumOrderValue: "",
      minimumCheckoutOrderValue: "",
    });
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

  const renderInputField = (config: SettingConfig) => {
    const fieldKey = config.key as string;
    const isEditing = editingField === fieldKey;
    const isUpdating = updatingKey === fieldKey;

    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.inputReadOnly,
          ]}
          keyboardType="numeric"
          value={
            isEditing
              ? tempValues[fieldKey]
              : String(settings?.[config.key] ?? "0")
          }
          onChangeText={(value) =>
            setTempValues((prev) => ({ ...prev, [fieldKey]: value }))
          }
          editable={isEditing}
          placeholder="Enter amount"
        />
        
        {!isEditing ? (
          <TouchableOpacity
            onPress={() => handleEditField(fieldKey)}
            style={styles.editButton}
            disabled={updatingKey !== null}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtons}>
            {isUpdating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => handleSaveField(fieldKey)}
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
    );
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
                renderInputField(config)
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