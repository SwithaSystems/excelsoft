import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import colors from "../config/colors";
import styles from './AdminNotificationSettingsStyles';

interface NotificationOptions {
  NewOrderUpdates: boolean;
  StockNotifications: boolean;
  Payment: boolean;
}


interface NotificationSettings {
  enabled: boolean;
  options: NotificationOptions;
}

interface SettingsState {
  pushNotifications: NotificationSettings;
  emailNotifications: NotificationSettings;
}

const AdminNotificationSettings: React.FC = () => {
  
    // Initial state with default values
    const [settings, setSettings] = useState<SettingsState>({
      pushNotifications: {
        enabled: true,
        options: {
          NewOrderUpdates: false,
          StockNotifications: false,
          Payment: false,
        },
      },
      emailNotifications: {
        enabled: true,
        options: {
          NewOrderUpdates: false,
          StockNotifications: false,
          Payment: false,
        },
      },
    });
  const toggleCategory = (category: keyof SettingsState) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [category]: {
          ...prevSettings[category],
          enabled: !prevSettings[category].enabled,
        },
      }));
    };

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

  return (
    <View style={globalStyles.container}>
      <Header headerText="Notification Settings" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
                  <View style={[globalStyles.mb_2]}>
                    <View style={[globalStyles.mb_2, styles.eachNotificationSection]}>
                      <Text style={styles.sectionTitle}>Push Notifications</Text>
                      <Switch
                        trackColor={{
                          false: colors.switchTrackOff,
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
                              false: colors.switchTrackOff,
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
          <View style={[globalStyles.mb_2]}>
            <View style={[globalStyles.mb_2, styles.eachNotificationSection]}>
              <Text style={styles.sectionTitle}>Email Notifications</Text>
              <Switch
                trackColor={{
                  false: colors.switchTrackOff,
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
                      false: colors.switchTrackOff,
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
      </ScrollView>
    </View>
  );
};

export default AdminNotificationSettings;
