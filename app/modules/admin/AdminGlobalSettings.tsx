import React, { useState } from "react";
import { View, Text, Switch, ActivityIndicator } from "react-native";
import styles from "./AdminGlobalSettingsStyles";
import colors from "@/constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Header from "@/app/components/Header";
import { GLOOBAL_SETTINGS_SCREEN_TITLE } from "@/constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import { useAppContext } from "@/context/AppContext";

// Define TypeScript interfaces for the settings
interface GlobalSettingsOptions {
  DisplayCarousal: boolean;
  TimeWindow: boolean;
  DeliveryMode: boolean;
}

interface GlobalSettings {
  enabled: boolean;
  options: GlobalSettingsOptions;
}

interface SettingsState {
  globalSettings: GlobalSettings;
}

const AdminGlobalSettings = () => {
  const { settings, toggleSetting, settingsLoading } = useAppContext();

  // Helper function to format option labels
  const formatOptionLabel = (key: string): string => {
    switch (key) {
      case "DisplayCarousal":
        return "Display Carousal";
      case "TimeWindow":
        return "Time Window";
      case "DeliveryMode":
        return "Delivery Mode";
      default:
        return key;
    }
  };

  // Helper function to get option descriptions
  const getOptionDescription = (key: string): string => {
    switch (key) {
      case "DisplayCarousal":
        return "Toggle to show or hide dynamic content carousels across the app, such as promotions or featured items.";
      case "TimeWindow":
        return "Add two hours default period to deliver the package once the user placed the order.";
      case "DeliveryMode":
        return "Allow customers to place delivery orders when enabled. Turn off to stop accepting deliveries.";
      default:
        return "";
    }
  };

  if (settingsLoading) {
    return <ActivityIndicator />;
  }

  return (
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable
      headerComponent={<Header headerText={GLOOBAL_SETTINGS_SCREEN_TITLE} />}
    >
      <View style={[globalStyles.pt_0]}>
        <View>
          {settings.globalSettings.enabled &&
            (
              Object.keys(settings.globalSettings.options) as Array<
                keyof GlobalSettingsOptions
              >
            ).map((optionKey) => (
              <>
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
                    value={settings.globalSettings.options[optionKey]}
                    onValueChange={() => toggleSetting(optionKey)}
                  />
                </View>
                <View>
                  <Text style={styles.switchDescription}>
                    {getOptionDescription(optionKey)}
                  </Text>
                </View>
              </>
            ))}
        </View>
      </View>
    </PageLayout>
  );
};

export default AdminGlobalSettings;
