import { USER_PROFILE_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import colors from "../../../constants/colors";
import styles from "./UserProfileStyles";
import { router } from "expo-router";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import {
  clearNavigationStack,
  redirectToPage,
} from "@/utilities/redirectionHelper";
import containers from "@/containers";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../../../services/notificationService";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserAPI } from "@/services/userService";
import { PageLayout } from "@/app/components/commonComponents/pageLayoutProps";
import Footer from "@/app/components/Footer";
import {
  ACCOUNT_DELETED,
  ACCOUNT_DELETION_ERROR,
} from "../../../constants/customErrorMessages";
import { showErrorAlert } from "../../../utilities/showErrorAlert";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
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
    "Edit Account Information": containers.editAccountInformationScreen,
    "Change Password": containers.changePasswordScreen,
    "Notification Settings": containers.notificationsScreen,
    "Customer Support": containers.customerSupportScreen,
    "Biometric settings": containers.biometricSettingsScreen,
    Feedback: containers.appReviewScreen,
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

  const handleLogout = async () => {
    try {
      // await AsyncStorage.removeItem("user");
      // await AsyncStorage.removeItem("token");
      await logout();
      setLogOutModalOpen(false);
      router.replace("/modules/home/Home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
      footerComponent={<Footer activeTab="menu" />}
      scrollable={true}
      contentPadding={true}
    >
      <View

      // style={[globalStyles.sectionContent, styles.pt_0]}
      >
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

        <TouchableOpacity
          style={styles.editProfile}
          onPress={() => {
            redirectToPage(containers.editProfileScreen);
          }}
        >
          <Text style={styles.editText}>Edit Profile</Text>
          <MaterialIcons name="edit" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              redirectToPage(containers.myOrderScreen, {
                userId: userData_redux?._id
                  ? userData_redux?._id
                  : userData_redux?.id,
              });
            }}
          >
            <FontAwesome name="briefcase" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Your Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              redirectToPage(containers.savedItemScreen);
            }}
          >
            <FontAwesome name="heart" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Saved Items</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              redirectToPage(containers.savedAddressScreen);
            }}
          >
            <FontAwesome name="map-marker" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Saved Address</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="credit-card" size={32} color={colors.primary} />
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
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.placeholdergrey}
              />
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

      <ConfirmationModal
        onClose={() => setLogOutModalOpen(false)}
        isModalVisible={logOutModalOpen}
        text="Are you sure you want to Log out?"
        submitText="Yes"
        handleSubmit={handleLogout}
        cancelText="No"
        handleCancel={() => setLogOutModalOpen(false)}
      />
      <ConfirmationModal
        onClose={() => setDeleteAccountModalOpen(false)}
        isModalVisible={deleteAccountModalOpen}
        text="Are you sure you want to delete your account? This action cannot be undone."
        submitText="Yes"
        handleSubmit={() => {}}
        cancelText="No"
        handleCancel={() => setDeleteAccountModalOpen(false)}
      />
    </PageLayout>
  );
};

export default UserProfileScreen;
