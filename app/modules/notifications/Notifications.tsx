import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, useWindowDimensions } from "react-native";
import colors from "../../../constants/colors";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect } from "react";
import { Alert } from "react-native";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { NOTIFICATIONS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import styles from "./NotificationsStyles";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

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

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={NOTIFICATIONS_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasFooter={isTabOrDesktop}
      hasHeader
      scrollable={!isTabOrDesktop}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isTabOrDesktop}
      userSidebar={true}
    >
      <View
        style={[
          // globalStyles.sectionContent,
          globalStyles.pt_0,
          isTabOrDesktop && webStyles.contentWidth,
        ]}
      >
        <View
          style={
            [
              // globalStyles.mb_2
            ]
          }
        >
          <View
            style={[
              // globalStyles.mb_2,
              styles.eachNotificationSection,
            ]}
          >
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
        <View
        // style={[globalStyles.mb_2]}
        >
          <View
            style={[
              // globalStyles.mb_2,
              styles.eachNotificationSection,
            ]}
          >
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
    </LayoutComponent>
  );
};

export default notificationsScreen;

const webStyles = StyleSheet.create({
  contentWidth: {
    width: "70%",
    alignSelf: "center",
  },
});
