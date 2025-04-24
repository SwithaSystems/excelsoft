import React, { useState, useEffect, useRef } from "react";
import styles from './AdminUserProfileStyles';
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
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
import { router } from "expo-router";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../../services/notificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import AdminFooter from "../AdminFooter/AdminFooter";

const AdminUserProfile = () => {
  const [user, setUser] = useState<{
      id: number;
      firstName: string;
      lastName: string;
    } | null>(null);

    const settingsMenu = {
        "Edit Profile": containers.editAccountInformationscreenScreen,
        "Notification Settings": containers.AdminNotificationSettingsScreen,
        "Store Information": containers.AdminStoreInformationScreen,
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
      </ScrollView>
      <AdminFooter/>
    </View>
  );
};

export default AdminUserProfile;
