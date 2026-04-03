import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "./AdminGlobalSettingsStyles";
import colors from "@/constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Header from "@/app/components/Header";
import { GLOOBAL_SETTINGS_SCREEN_TITLE } from "@/constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import globalSettingsAPI, {
  GlobalSettingsDto,
} from "@/services/globalSettingsService";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";

interface SettingConfig {
  key: keyof GlobalSettingsDto;
  label: string;
  description: string;
  type?: "switch" | "input" | "deliveryModes";
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
    key: "deliveryModes",
    label: "Delivery Modes",
    description:
      "Allow customers to place delivery orders when enabled. Turn off to stop accepting deliveries.",
    type: "deliveryModes",
  },
  {
    key: "timeWindow",
    label: "Time Window",
    description:
      "Add default period to deliver the package once the user placed the order. Please add the time in minutes only.",
    type: "input",
  },
  {
    key: "shippingCharge",
    label: "Shipping Charge",
    description: "Default delivery charge applied to all delivery orders.",
    type: "input",
  },
  {
    key: "minimumCheckoutOrderValue",
    label: "Minimum Checkout Order Value",
    description: "Minimum Checkout order value required for customers to place an order.",
    type: "input",
  },
  {
    key: "minimumDeliveryOrderValue",
    label: "Minimum Delivery Order Value",
    description: "Minimum Delivery order value required to proceed to checkout.",
    type: "input",
  },
];

const AdminGlobalSettings = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

  const [settings, setSettings] = useState<GlobalSettingsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  
  // Track editing state for each input field
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({
    shippingCharge: "",
    minimumCheckoutOrderValue: "",
    minimumDeliveryOrderValue: "",
    timeWindow: "",
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
      showAlert("Error", "Failed to load settings. Please try again.");
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
      showAlert("Invalid value", `Please enter a valid ${fieldKey.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
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
      showAlert("Error", `Failed to update ${fieldKey.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
      fetchSettings();
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValues({
      shippingCharge: "",
      minimumCheckoutOrderValue: "",
      minimumDeliveryOrderValue: "",
      timeWindow: "",
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
      showAlert("Error", `Failed to update ${key}. Please try again.`);
    } finally {
      setUpdatingKey(null);
    }
  };

  const renderInputField = (config: SettingConfig) => {
    const fieldKey = config.key as string;
    const isEditing = editingField === fieldKey;
    const isUpdating = updatingKey === fieldKey;
    const displayValue =
      fieldKey === "timeWindow" &&
      (settings?.[config.key] === null || settings?.[config.key] === undefined)
        ? "120"
        : String(settings?.[config.key] ?? "0");

    return (
      <View
        style={[
          styles.inputContainer,
          styles.inputContainerBelowLabel,
          isWeb && !isMobile && styles.inputContainerBelowLabelDesktopWeb,
          isMobileWeb && styles.inputContainerMobileWeb,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            styles.inputText,
            !isEditing && styles.inputReadOnly,
          ]}
          keyboardType="numeric"
          value={isEditing ? tempValues[fieldKey] : displayValue}
          onChangeText={(value) =>
            setTempValues((prev) => ({ ...prev, [fieldKey]: value }))
          }
          editable={isEditing && updatingKey === null}
          placeholder={
            fieldKey === "timeWindow"
              ? "Enter minutes (e.g., 120)"
              : "Enter amount"
          }
          placeholderTextColor={colors.slateGrey}
        />
        
        {!isEditing ? (
          <TouchableOpacity
            onPress={() => handleEditField(fieldKey)}
            style={styles.editButton}
            disabled={updatingKey !== null}
          >
            <Text style={styles.editText}>Edit</Text>
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
const renderDeliveryModes = () => {
  if (!settings) return null;

  const modes = settings.deliveryModes;

  const toggleMode = async (
    key: keyof GlobalSettingsDto["deliveryModes"]
  ) => {
    const updatedModes = {
      ...modes,
      [key]: !modes[key],
    };

    setUpdatingKey("deliveryModes");

    setSettings((prev) =>
      prev ? { ...prev, deliveryModes: updatedModes } : prev
    );

    try {
      await globalSettingsAPI.updateAllSettings({
        deliveryModes: updatedModes,
      });
    } catch (error) {
      console.error("Failed to update delivery modes:", error);
      showAlert("Error", "Failed to update delivery modes");
      fetchSettings();
    } finally {
      setUpdatingKey(null);
    }
  };

  const deliveryModeOptions: {
    key: keyof GlobalSettingsDto["deliveryModes"];
    label: string;
    description: string;
  }[] = [
    {
      key: "homeDelivery",
      label: "Home Delivery",
      description:
        "Allow customers to place delivery orders when enabled. Turn off to stop accepting deliveries.",
    },
    {
      key: "curbsidePickup",
      label: "Curbside Pickup",
      description:
        "Allow customers to pick up orders without entering the store.",
    },
    {
      key: "storePickup",
      label: "Store Pickup",
      description:
        "Allow customers to pick up orders directly from the store.",
    },
  ];

  return (
    <View style={{ width: "100%", marginTop: 8 }}>
      <Text style={styles.switchLabel}>Delivery Modes</Text>
      <Text style={{ fontSize: 14,
          fontWeight: "300",
          color: colors.black,
          flex: 1,
          marginTop: 8}}>
        Choose which delivery options that a user can avail.
      </Text>
      {deliveryModeOptions.map((item) => (
        <View key={item.key}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{item.label}</Text>

            <View
              style={[
                styles.switchWrapper,
                isMobileWeb && styles.switchWrapperMobileWeb,
              ]}
            >
              {updatingKey === "deliveryModes" && (
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
                value={Boolean(modes[item.key])}
                onValueChange={() => toggleMode(item.key)}
                disabled={updatingKey !== null}
              />
            </View>
          </View>

          <Text style={styles.switchDescription}>{item.description}</Text>
        </View>
      ))}
    </View>
  );
};

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={GLOOBAL_SETTINGS_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : undefined;

  if (loading) {
    return (
      <LayoutComponent
        hasHeader
        headerComponent={HeaderComponent}
        scrollable
        hasFooter={isWeb}
        footerComponent={FooterComponent}
        hasSidebar={isWeb}
        hideNavItems={isWeb}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
        {confirmationModal}
      </LayoutComponent>
    );
  }

  if (!settings) {
    return (
      <LayoutComponent
        hasHeader
        headerComponent={HeaderComponent}
        scrollable
        hasFooter={isWeb}
        footerComponent={FooterComponent}
        hasSidebar={isWeb}
        hideNavItems={isWeb}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load settings</Text>
        </View>
        {confirmationModal}
      </LayoutComponent>
    );
  }

  const settingsContent = (
    <View
      style={[
        globalStyles.pt_0,
        isWeb && styles.webContent,
        isMobileWeb && styles.webContentMobile,
      ]}
    >
      {SETTINGS_CONFIG.map((config) => (
        <View key={config.key}>
          <View
            style={[
              styles.switchContainer,
              config.type === "input" && styles.switchContainerInput,
              isMobileWeb && styles.switchContainerMobileWeb,
            ]}
          >
            {config.type !== "deliveryModes" && (
            <Text
              style={[
                styles.switchLabel,
                config.type === "input" && styles.switchLabelInput,
              ]}
            >
              {config.label}
            </Text>
          )}
          {config.type === "switch" ? (
            <View
              style={[
                styles.switchWrapper,
                isMobileWeb && styles.switchWrapperMobileWeb,
              ]}
            >
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
                onValueChange={() => handleToggle(config.key as keyof Omit<GlobalSettingsDto, "updatedAt">)}
                disabled={updatingKey !== null}
              />
            </View>
          ) : config.type === "deliveryModes" ? (
            renderDeliveryModes()
          ) : (
            renderInputField(config)
          )}
                </View>
              {config.type !== "deliveryModes" && (
                <Text style={styles.switchDescription}>
                  {config.description}
                </Text>
              )}
              </View>
            ))}
          </View>
        );

        console.log("settings:", settings);

  if (isWeb) {
    return (
      <LayoutComponent
        hasHeader
        headerComponent={HeaderComponent}
        scrollable
        hasFooter={isWeb}
        footerComponent={FooterComponent}
        hasSidebar={isWeb}
        hideNavItems={isWeb}
      >
        {settingsContent}
        {confirmationModal}
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      scrollable={false}
      hasFooter={false}
      footerComponent={undefined}
      hasSidebar={false}
      hideNavItems={false}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={100}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {settingsContent}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      {confirmationModal}
    </LayoutComponent>
  );
};

export default AdminGlobalSettings;
