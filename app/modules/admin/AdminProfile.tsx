import { USER_PROFILE_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { router } from "expo-router";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useState, useEffect, useRef } from "react";
import containers from "@/containers";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../../../services/notificationService";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserAPI } from "@/services/userService";
import { PageLayout } from "@/app/components/commonComponents/pageLayoutProps";
import Footer from "@/app/components/Footer";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import styles from "./AdminProfileStyle";
import AdminFooter from "@/app/components/AdminFooter";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const AdminProfile = () => {
  const notificationListener = useRef<
    Notifications.EventSubscription | undefined
  >(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(
    undefined
  );
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: number;
    _id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  } | null>(null);
  const userData_redux = useSelector((state: RootState) => state.user.user);

  const settingsMenu = {
    "Edit Profile": containers.editProfileScreen,
    "Notification Settings": containers.adminNotificationSettingsScreen,
    "Store Information": containers.AdminStoreInformationScreen,
    "Promotion Management": containers.customerSupportScreen,
    "Global settings": containers.AdminGlobalSettingsScreen,
  };

  console.log("userData_redux in userProfilescreen", userData_redux);
  useEffect(() => {
    const fetchUser = async () => {
      if (!userData_redux?.id) return;

      try {
        const response = await UserAPI.getUserById(
          userData_redux?._id ? userData_redux?._id : userData_redux?.id
        );
        console.log("response in userProfilescreen", response?.data);
        if (response?.data) {
          setUser(response.data);
        } else {
          console.warn("No user data received");
        }
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };

    fetchUser();
  }, [userData_redux]);

  console.log("user details fetched", user);
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

  return (
    <PageLayout
      hasHeader={true}
      hasFooter={true}
      headerComponent={
        <Header
          headerText={USER_PROFILE_SCREEN_TITLE}
          needResetNavigation={true}
        />
      }
      footerComponent={<AdminFooter />}
      scrollable={true}
      contentPadding={true}
    >
      <View>
        <Text style={styles.greeting}>
          {user?.firstName ? `Hello, ${user.firstName}` : "Hello, User"}
        </Text>
        <Image
          source={
            user?.profileImageUrl
              ? { uri: user?.profileImageUrl }
              : require("@/assets/default_user_profile.png")
          }
          style={globalStyles.profileImage}
        />
        <Text style={styles.userName}>
          {user?.firstName || ""} {user?.lastName || ""}
        </Text>

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
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.placeholdergrey}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </PageLayout>
  );
};

export default AdminProfile;
