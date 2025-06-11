import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import styles from "./editAccountInformationscreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { FontAwesome } from "@expo/vector-icons";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { Image } from "react-native-elements";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../config/colors";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserAPI } from "@/services/userService";
import { TwilioApi } from "@/services/twilioService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "@/store/slices/userSlice";
import PageLayout from "../pageLayoutProps";

const editAccountInformationscreen = () => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const userData = useSelector((state: RootState) => state.user.user);
  console.log("userData in edit account information", userData);

  useEffect(() => {
    const getUser = async () => {
      console.log("userData", userData);
      if (userData) {
        const user = await UserAPI.getUserByPhonenumber(userData?.phone);
        console.log("user", user.data);
        if (user) {
          setId(user.data._id);
          setPhone(user.data.phone);
          setEmail(user.data?.email || "No mail added");
          setProfileImage(user.data.profileImageUrl);
        }
      }
    };
    getUser();
  }, [userData]);

  const handleVerify = async () => {
    try {
      const responseFromTwilio = await TwilioApi.sendOtp({
        phone: phone,
      });
      console.log("responseFromTwilio", responseFromTwilio);
      if (
        responseFromTwilio?.status === 201 &&
        responseFromTwilio.data?.status === "pending"
      ) {
        // OTP sent successfully, proceed to verification screen
        redirectToPage(containers.verifcationScreenScreen, {
          phoneNumber_editAccount: phone,
          from: "verify",
        });
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Something went wrong during registration.");
    }
  };
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("email", email);
    try {
      const response = await UserAPI.userEditContact(id, formData);
      console.log("response in edit contact", response.data);
      if (response?.data) {
        console.log("Inside");
        DeviceEventEmitter.emit("fetchUser");
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        dispatch(setUserData(response.data.user));
        Alert.alert("Message", "Profile updated successfully.", [
          {
            text: "OK",
            onPress: () => {
              redirectToPage(containers.userProfileScreenScreen);
            },
          },
        ]);
      }
      return response?.data;
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Something went wrong during registration.");
    }
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable
      headerComponent={<Header headerText="Edit Contact Information" />}
    >
      <KeyBoardWrapper>
        {/* <View style={globalStyles.container}> */}
        {/* <Header headerText="Edit Contact Information" /> */}
        {/* <ScrollView> */}
        <View style={[
            // globalStyles.sectionContent, 
            globalStyles.pt_0
          ]}>
          <View style={globalStyles.profilePictureContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../../assets/default_user_profile.png")
              }
              style={globalStyles.profileImage}
            />
          </View>
          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="phone"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <View style={globalStyles.deviceHeading}>
                <Text style={globalStyles.userInputLabel}>Phone</Text>
                {/* <TouchableOpacity>
                      <Text
                        style={globalStyles.verify}
                        onPress={() => {
                          handleVerify();
                        }}
                      >
                        verify
                      </Text>
                    </TouchableOpacity> */}
              </View>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="phone number"
                value={phone}
                onPress={() => {}}
                setValue={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="envelope-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ 
              flex: 1, 
              paddingLeft: 14 
            }}>
              <View style={globalStyles.deviceHeading}>
                <Text style={globalStyles.userInputLabel}>Email</Text>
                {/* <TouchableOpacity>
                      <Text style={globalStyles.verify}>verify</Text>
                    </TouchableOpacity> */}
              </View>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="email"
                value={email}
                onPress={() => {}}
                setValue={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
        <View 
        // style={
        //   // globalStyles.p_3
        // }
        >
          <Button
            onPress={() => {
              handleSave();
              // redirectToPage(containers.userProfileScreenScreen);
            }}
            title="Save"
          />
        </View>
        {/* </View> */}
      </KeyBoardWrapper>
    </PageLayout>
    /* </SafeAreaView> */
  );
};

export default editAccountInformationscreen;
