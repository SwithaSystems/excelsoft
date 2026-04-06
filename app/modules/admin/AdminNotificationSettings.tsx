import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { FC, useState } from "react";
import { View, Text, Switch, StyleSheet, Platform } from "react-native";
import colors from "../../../constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import styles from "./AdminnotificationSettingsStyles";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

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

const AdminNotificationSettings: FC = () => {
  const screenTitle = "Notification Settings";
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

  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={screenTitle} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasFooter={isWeb}
      hasHeader
      scrollable={true}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
    >
      <View
        style={[
          globalStyles.pt_0,
          isWeb && webStyles.contentWidth,
          isMobileWeb && webStyles.mobileWebContentWidth,
          !isWeb && mobileStyles.contentContainer,
        ]}
      >
        <View style={[webStyles.sectionCard, !isWeb && mobileStyles.sectionCard]}>
          <View style={styles.eachNotificationSection}>
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
            ).map((optionKey, idx) => (
              <View
                style={[
                  styles.switchContainer,
                  isWeb && webStyles.mobileWebOptionRow,
                  isWeb && idx === 0 && webStyles.mobileWebOptionRowFirst,
                  !isWeb && mobileStyles.optionRow,
                  !isWeb && idx === 0 && mobileStyles.optionRowFirst,
                ]}
                key={optionKey}
              >
                <Text style={styles.switchLabel}>{formatOptionLabel(optionKey)}</Text>
                <Switch
                  trackColor={{
                    false: colors.placeholdergrey,
                    true: colors.primary,
                  }}
                  thumbColor={colors.white}
                  value={settings.pushNotifications.options[optionKey]}
                  onValueChange={() => toggleOption("pushNotifications", optionKey)}
                />
              </View>
            ))}
        </View>

        <View
          style={[
            isMobileWeb && webStyles.mobileWebEmailSectionSpacing,
            webStyles.sectionCard,
            !isWeb && mobileStyles.sectionCard,
          ]}
        >
          <View style={styles.eachNotificationSection}>
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
            ).map((optionKey, idx) => (
              <View
                style={[
                  styles.switchContainer,
                  isWeb && webStyles.mobileWebOptionRow,
                  isWeb && idx === 0 && webStyles.mobileWebOptionRowFirst,
                  !isWeb && mobileStyles.optionRow,
                  !isWeb && idx === 0 && mobileStyles.optionRowFirst,
                ]}
                key={optionKey}
              >
                <Text style={styles.switchLabel}>{formatOptionLabel(optionKey)}</Text>
                <Switch
                  trackColor={{
                    false: colors.placeholdergrey,
                    true: colors.primary,
                  }}
                  thumbColor={colors.white}
                  value={settings.emailNotifications.options[optionKey]}
                  onValueChange={() => toggleOption("emailNotifications", optionKey)}
                />
              </View>
            ))}
        </View>
      </View>
    </LayoutComponent>
  );
};
export default AdminNotificationSettings;

const webStyles = StyleSheet.create({
  contentWidth: {
    width: "60%",
    alignSelf: "center",
  },
  mobileWebContentWidth: {
    width: "94%",
    alignSelf: "center",
  },
  mobileWebEmailSectionSpacing: {
    // marginTop: 16,
  },
  mobileWebOptionRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  mobileWebOptionRowFirst: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    marginBottom: 24,
  },
});

const mobileStyles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 4,
  },
  sectionCard: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  optionRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  optionRowFirst: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
