import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import styles from "./userProfileScreenStyles";
import { router } from "expo-router";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const userProfileScreen = () => {
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const settingsMenu = {
    "Edit Account Information": containers.editAccountInformationscreenScreen,
    "Change Password": containers.changePasswordScreenScreen,
    "Notification Settings": containers.notificationsScreenScreen,
    "Customer Support": containers.customerSupportScreenScreen,
    Feedback: containers.feedBackScreenScreen,
  };
  const user = {
    firstName: "Katleena",
    lastName: "Dennis",
  };

  return (
    <View style={globalStyles.container}>
      <Header headerText="User Profile" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.greeting}>Hello, {user.firstName}</Text>
          <Image
            source={require("../../assets/images/icon.png")}
            style={globalStyles.profileImage}
          />
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
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
                  redirectToPage(settingsMenu[eachSetting as keyof typeof settingsMenu]);
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
      {/* logout modal */}
      <ConfirmationModal
        onClose={() => {
          setLogOutModalOpen(false);
        }}
        isModalVisible={logOutModalOpen}
        text="Are you sure you want to Log out?"
        submitText="Yes"
        handleSubmit={() => {}}
        cancelText="No"
        handleCancel={() => {
          setLogOutModalOpen(false);
        }}
      />
      {/* delete account modal */}
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

export default userProfileScreen;
