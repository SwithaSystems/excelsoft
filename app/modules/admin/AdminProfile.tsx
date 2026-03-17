import { ADMIN_PROFILE_SCREEN_TITLE } from "../../../constants/stringLiterals";
import Header from "../../components/Header";
import {Ionicons} from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useState, useEffect, useRef } from "react";
import containers from "@/containers";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../../../services/notificationService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserAPI } from "@/services/userService";
import { PageLayout } from "@/app/components/commonComponents/pageLayoutProps";
import { Text, TouchableOpacity, View, StyleSheet, useWindowDimensions, Platform, ActivityIndicator } from "react-native";
import styles from "./AdminProfileStyle";
import AdminFooter from "@/app/components/AdminFooter";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";

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
  const [profileLoading, setProfileLoading] = useState(true);
  const userData_redux = useSelector((state: RootState) => state.user.user);
  const [isSuperAdmin, setIsSuperAdmin] = React.useState<any>(null);
  

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMobile = !isWeb;
   const fetchUser = async () => {
      try {
        const user = await UserAPI.getUserById(
          userData_redux?._id ? userData_redux?._id : userData_redux?.id
        );
        if (user) {
          setIsSuperAdmin(user?.data?.isSuperAdmin);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    React.useEffect(() => {
      fetchUser();
    }, []);

  // Define base settings menu
  const baseSettingsMenu = {
    "Notification Settings": containers.adminNotificationSettingsScreen,
    "Store Information": containers.AdminStoreInformationScreen,
    "Global settings": containers.AdminGlobalSettingsScreen,
    "Promotion Management": containers.AdminPromotionScreen,
    "Scan & Deliver": containers.AdminOrderQRScanScreen,
    "Upload Bulk Data": containers.fileUploadAddProductCategoryScreen,
  };

  // Conditionally add User Admin Access if isSuperAdmin is true
  const settingsMenu = {
    ...baseSettingsMenu,
    ...(isSuperAdmin && { "User Admin Access": containers.adminAccessControlScreen }),
  };
  // Responsive components
  const HeaderComponent = isWeb ? <BrandHeaderWeb hideUserGreeting={true} /> : (
    <Header
      headerText={ADMIN_PROFILE_SCREEN_TITLE}
      needResetNavigation={false}
    />
  );
  
  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="menu" />;
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  
  useEffect(() => {
    const fetchUser = async () => {
      if (!userData_redux?.id) {
        setProfileLoading(false);
        return;
      }

      try {
        const response = await UserAPI.getUserById(
          userData_redux?._id ? userData_redux?._id : userData_redux?.id
        );
        if (response?.data) {
          setUser(response.data);
        } else {
          console.warn("No user data received");
        }
      } catch (err) {
        console.error("User fetch failed", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUser();
  }, [userData_redux]);
  
  useEffect(() => {
    const getToken = async () => {
      if (user?.id) {
        const token =
          await NotificationService.registerForPushNotificationsAsync(
            user.id.toString()
          );
        setExpoPushToken(token ?? null);
      }
    };
    getToken();


    return () => {
      if (notificationListener.current) {
        try {
          notificationListener.current.remove();
        } catch (error) {
          console.warn("Error removing notification listener:", error);
        }
      }
      if (responseListener.current) {
        try {
          responseListener.current.remove();
        } catch (error) {
          console.warn("Error removing response listener:", error);
        }
      }
    };
  }, [user]);

  if (profileLoading) {
    return (
      <LayoutComponent
        hasHeader
        headerComponent={HeaderComponent}
        hasFooter
        footerComponent={FooterComponent}
        hasSidebar={isWeb}
        scrollable
        hideNavItems={true}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isWeb}
      scrollable
      hideNavItems={true}
    >
      <View style={[
        responsiveStyles.container,
        isWeb && responsiveStyles.containerWeb
      ]}>
        <View style={[
          responsiveStyles.profileCard,
          isWeb && responsiveStyles.profileCardWeb
        ]}>
        </View> 

        <View style={[
          isMobile ? styles.settingsContainer : responsiveStyles.settingsContainerWeb
        ]}>
          {Object.keys(settingsMenu).map((eachSetting, index) => (
            <TouchableOpacity
              key={index}
              style={[
                isMobile ? styles.settingOption : responsiveStyles.settingOptionWeb
              ]}
              onPress={() => {
                redirectToPage(
                  settingsMenu[eachSetting as keyof typeof settingsMenu]
                );
              }}
            >
              <Text style={[
                isMobile ? styles.settingText : responsiveStyles.settingTextWeb
              ]}>
                {eachSetting}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={isWeb ? 22 : 18}
                color={colors.placeholdergrey}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LayoutComponent>
  );
};

const responsiveStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerWeb: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  profileCard: {
    alignItems: 'center',
  },
  profileCardWeb: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 40,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  greetingWeb: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 20,
  },
  profileImageWeb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: colors.lightgrey,
  },
  userNameWeb: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.black,
  },
  settingsContainerWeb: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  settingOptionWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
    borderRadius: 8,
    cursor: 'pointer',
  },
  settingTextWeb: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    flex: 1,
  },
});

export default AdminProfile;