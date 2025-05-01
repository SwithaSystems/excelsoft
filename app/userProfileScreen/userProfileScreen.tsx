import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Button,
  Platform,
} from "react-native";
import colors from "../config/colors";
import styles from "./userProfileScreenStyles";
import { router } from "expo-router";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../../services/notificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { deviceType } from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const UserProfileScreen = () => {
  const { logout } = useAuth();
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const notificationListener = useRef<
    Notifications.EventSubscription | undefined
  >(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(
    undefined
  );
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: number;
    firstName: string;
    lastName: string;
  } | null>(null);

  const settingsMenu = {
    "Edit Account Information": containers.editAccountInformationscreenScreen,
    "Change Password": containers.changePasswordScreenScreen,
    "Notification Settings": containers.notificationsScreenScreen,
    "Customer Support": containers.customerSupportScreenScreen,
    "Feedback": containers.AppReviewScreenScreen,
    "Store Information": containers.AdminDashboardScreen,
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user || "User");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      if (user?.id) {
        const token =
          await NotificationService.registerForPushNotificationsAsync(
            user.id.toString()
          );
          console.log("Expo Push Token:", token);
          setExpoPushToken(token ?? null);
      }
    };
    getToken();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User interacted with notification:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      await logout();
      setLogOutModalOpen(false);
      redirectToPage(containers.signInScreen);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header headerText="User Profile" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.greeting}>
            Hello, {user?.firstName || "User"}
          </Text>
          <Image
            source={{ uri: "https://picsum.photos/100" }}
            style={globalStyles.profileImage}
          />
          <Text style={styles.userName}>
            {user?.firstName || ""} {user?.lastName || ""}
          </Text>

          <TouchableOpacity
            style={styles.editProfile}
            onPress={() => {
              redirectToPage(containers.editProfileScreenScreen);
            }}
          >
            <Text style={styles.editText}>Edit Profile</Text>
            <MaterialIcons name="edit" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.quickActions}>
            {/*<Button
              title="Send Test Notification"
              onPress={async () => {
                await Notifications.cancelAllScheduledNotificationsAsync();

                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "🚀 Notification Test",
                    body: "This is a push notification test!",
                  },
                  trigger: {
                    seconds: 2,
                    repeats: false,
                    type: "timeInterval",
                  } as Notifications.TimeIntervalTriggerInput,
                });
              }}
            /> */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                redirectToPage(containers.myOrderScreenScreen);
              }}
            >
              <FontAwesome name="briefcase" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Your Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                redirectToPage(containers.savedItemScreenScreen);
              }}
            >
              <FontAwesome name="heart" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Saved Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                redirectToPage(containers.savedAddressScreenScreen);
              }}
            >
              <FontAwesome name="map-marker" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Saved Address</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome
                name="credit-card"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.actionText}>Payments</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.settingsTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            {Object.keys(settingsMenu).map((eachSetting, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingOption}
                onPress={() => {
                  redirectToPage(
                    settingsMenu[eachSetting as keyof typeof settingsMenu]
                  );
                }}
              >
                <Text style={styles.settingText}>{eachSetting}</Text>
                <Ionicons name="chevron-forward" size={18} color="black" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                setLogOutModalOpen(true);
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="black" />
              <Text style={styles.footerText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                setDeleteAccountModalOpen(true);
              }}
            >
              <MaterialIcons name="delete" size={24} color="black" />
              <Text style={styles.footerText}>Close Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ConfirmationModal
        onClose={() => {
          setLogOutModalOpen(false);
        }}
        isModalVisible={logOutModalOpen}
        text="Are you sure you want to Log out?"
        submitText="Yes"
        handleSubmit={handleLogout}
        cancelText="No"
        handleCancel={() => {
          setLogOutModalOpen(false);
        }}
      />
      <ConfirmationModal
        onClose={() => {
          setDeleteAccountModalOpen(false);
        }}
        isModalVisible={deleteAccountModalOpen}
        text="Are you sure you want to delete your account? Do you want to reconsider your choice?"
        submitText="Yes"
        handleSubmit={() => {}}
        cancelText="No"
        handleCancel={() => {
          setDeleteAccountModalOpen(false);
        }}
      />
    </View>
  );
};

export default UserProfileScreen;
