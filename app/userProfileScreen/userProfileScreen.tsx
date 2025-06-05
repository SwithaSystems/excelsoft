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
  SafeAreaView,
} from "react-native";
import colors from "../config/colors";
import styles from "./userProfileScreenStyles";
import { router } from "expo-router";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import {
  clearNavigationStack,
  redirectToPage,
} from "@/utilities/redirectionHelper";
import containers from "@/containers";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../../services/notificationService";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { deviceType } from "expo-device";
// import axiosInstance from "@/services/axiosConfig";
import { useSelector } from "react-redux";
import { jsonAxios } from "@/services/axiosConfig";
import { RootState } from "@/store/store";
import { UserAPI } from "@/services/userService";
import Footer from "@/components/Footer";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Add this property
    shouldShowList: true, // Add this property
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
    _id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  } | null>(null);
  const userData_redux = useSelector((state: RootState) => state.user.user);

  const settingsMenu = {
    "Edit Account Information": containers.editAccountInformationscreenScreen,
    "Change Password": containers.changePasswordScreenScreen,
    "Notification Settings": containers.notificationsScreenScreen,
    "Customer Support": containers.customerSupportScreenScreen,
    Feedback: containers.AppReviewScreenScreen,
    // Admin: containers.AdminDashboardScreen,
  };

  // useEffect(() => {
  //   const getUser = async () => {
  //     console.log("userData", userData);
  //     if (userData) {
  //       const user = await UserAPI.getUserByPhonenumber(userData?.phone);
  //       console.log("user", user.data);
  //       if (user) {
  //         setFirstName(user.data.firstName);
  //         setLastName(user.data.lastName);
  //         setPhone(user.data.phone);
  //         setDateOfBirth(user.data.dateOfBirth);
  //         setEmail(user.data?.email || "No mail added");
  //         setProfileImage(user.data.profileImageUrl);
  //       }
  //     }
  //   };
  //   getUser();
  // }, [userData]);
  console.log("userData_redux in userProfilescreen", userData_redux);
  useEffect(() => {
    const fetchUser = async () => {
      if (!userData_redux?.id) return;

      try {
        const response = await UserAPI.getUserByPhonenumber(
          userData_redux?.phone
        );
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

  const handleLogout = async () => {
    try {
      // await AsyncStorage.removeItem("user");
      // await AsyncStorage.removeItem("token");
      await logout();
      setLogOutModalOpen(false);
      router.replace("/home/home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={globalStyles.container}>
        <Header headerText="User Profile" needResetNavigation={true} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
            <Text style={styles.greeting}>
              {user?.firstName ? `Hello, ${user.firstName}` : "Hello, User"}
            </Text>
            <Image
              source={
                user?.profileImageUrl
                  ? { uri: user?.profileImageUrl }
                  : require("../../assets/default_user_profile.png")
              }
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  redirectToPage(containers.myOrderScreenScreen, {
                    userId: userData_redux?._id
                      ? userData_redux?._id
                      : userData_redux?.id,
                  });
                }}
              >
                <FontAwesome
                  name="briefcase"
                  size={32}
                  color={colors.primary}
                />
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
                <FontAwesome
                  name="map-marker"
                  size={32}
                  color={colors.primary}
                />
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
      <Footer activeTab="menu" />
    </SafeAreaView>
  );
};

export default UserProfileScreen;
