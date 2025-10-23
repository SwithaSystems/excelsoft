import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import styles from "./AdminGlobalSettingsStyles";
import colors from "@/constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Header from "@/app/components/Header";
import { GLOOBAL_SETTINGS_SCREEN_TITLE } from "@/constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";

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
  const [settings, setSettings] = useState<SettingsState>({
    globalSettings: {
      enabled: true,
      options: {
        DisplayCarousal: false,
        TimeWindow: false,
        DeliveryMode: false,
      },
    },
  });

  // Function to toggle individual options within a category
  const toggleOption = (
    category: keyof SettingsState,
    option: keyof GlobalSettingsOptions
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
                    onValueChange={() =>
                      toggleOption("globalSettings", optionKey)
                    }
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
