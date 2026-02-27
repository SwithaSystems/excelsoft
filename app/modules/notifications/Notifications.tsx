import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, Platform } from "react-native";
import colors from "../../../constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { NOTIFICATIONS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import styles from "./NotificationsStyles";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

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

  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;


  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={NOTIFICATIONS_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasFooter={isWeb}
      hasHeader
      scrollable={isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
      userSidebar={true}
    >
      <View
        style={[
          globalStyles.pt_0,
          isWeb && webStyles.contentWidth,
          isMobileWeb && webStyles.mobileWebContentWidth,
        ]}
      >

        <View
          style={
            [
              // globalStyles.mb_2
               webStyles.sectionCard,
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
              <View
                style={[
                  styles.switchContainer,
                  isWeb && webStyles.mobileWebOptionSpacing,
                ]}
                key={optionKey}
              >
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
          style={[
            isMobileWeb && webStyles.mobileWebEmailSectionSpacing,
            webStyles.sectionCard,
          ]}
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
              <View
                style={[
                  styles.switchContainer,
                  isWeb && webStyles.mobileWebOptionSpacing,
                ]}
                key={optionKey}
              >
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
    width: "60%",
    alignSelf: "center",
  },
  mobileWebContentWidth: {
    width: "94%",
    alignSelf: "center",
  },
  mobileWebSwitchContainer: {
    paddingVertical: 4,
  },
  mobileWebEmailSectionSpacing: {
    // marginTop: 16,
  },
  mobileWebOptionSpacing: {
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.placeholdergrey, // very subtle
    marginBottom: 24,
  },

});
