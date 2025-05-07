import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import Header from "@/components/Header";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from "react-native-elements";
import { UserAPI } from "@/services/userService";
import Bcrypt from "react-native-bcrypt";
import { useSelector } from "react-redux";

const changePasswordScreen = () => {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      // const userData = await AsyncStorage.getItem("user");
      if (user) {
        // const user = JSON.parse(userData);
        console.log("user in change password", user);
        setPhoneNumber(user.phone);
        setExistingPassword(user.password);
      }
    };

    fetchUser();
  }, [user]);

  console.log("phone in change password", phoneNumber);

  const comparePasswords = async (
    currentPassword: any,
    existingPassword: any
  ) => {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(currentPassword, existingPassword, function (err, res) {
        if (err) reject(err);
        else resolve(res); // true if match, false otherwise
      });
    });
  };

  const handleBlur = async (currentPassword: string) => {
    const isMatch = await comparePasswords(currPassword, existingPassword);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      alert("Current password is incorrect");
    }
  };
  const handleChangePassword = async () => {
    if (!currPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New and Confirm passwords do not match");
      return;
    }

    try {
      const response = await UserAPI.changePassword({ newPassword });
      console.log("response", response.data);
      if (response.data.message === "Password successfully changed") {
        alert("Password successfully changed");
        redirectToPage(containers.signInScreen);
      } else {
        alert("Failed to change password");
        redirectToPage(containers.userProfileScreenScreen);
      }
    } catch (err) {
      alert("Failed to change password");
      console.error(err);
      redirectToPage(containers.userProfileScreenScreen);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header headerText="Change Password" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <View style={globalStyles.profilePictureContainer}>
            <Image
              source={{ uri: "https://picsum.photos/100" }}
              style={globalStyles.profileImage}
            />
          </View>
          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>Current Password</Text>
              <CustomTextInput
                secureTextEntry={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Enter your current Password"
                value={currPassword}
                onPress={() => {}}
                setValue={setCurrPassword}
                onblur={() => {
                  handleBlur(currPassword);
                }}
              />
            </View>
          </View>
          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>New Password</Text>
              <CustomTextInput
                secureTextEntry={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Enter your new Password"
                value={newPassword}
                onPress={() => {}}
                setValue={setNewPassword}
              />
            </View>
          </View>
          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>
                Confirm New Password
              </Text>
              <CustomTextInput
                secureTextEntry={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Re-enter your new Password"
                value={confirmPassword}
                onPress={() => {}}
                setValue={setConfirmPassword}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={globalStyles.p_3}>
        <Button
          onPress={() => {
            handleChangePassword();
          }}
          title="Save Password"
        />
      </View>
    </View>
  );
};

export default changePasswordScreen;
