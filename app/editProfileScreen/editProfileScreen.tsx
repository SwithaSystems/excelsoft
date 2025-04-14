import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import Header from "@/components/Header";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Image } from "react-native-elements";
import styles from "./editProfileScreenStyles";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";
import { useDerivedValue } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAPI } from "@/services/userService";
import { Text } from "react-native-elements";

interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  dateOfBirth: string;
}

const editProfileScreen = () => {
  const [firstName, setFirstName] = useState("Katleena M.");
  const [lastName, setLastName] = useState("Dennis");
  const [dateOfBirth, setDateOfBirth] = useState("01/02/1999");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [email, setEmail] = useState("Denniskatleenam@gmail.com");
  const [role, setRole] = useState("Store Manager");
  const [profileImage, setProfileImage] = useState("https://picsum.photos/100");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString: any = await AsyncStorage.getItem("user");
        // const user = userString ? JSON.parse(userString) : null;
        // console.log("userString", user?.id);
        if (userString) {
          setUser(JSON.parse(userString));
        } else {
          console.log("No user found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setDateOfBirth(user.dateOfBirth);
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    //ask for camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleEditProfile = async () => {
    if (!firstName.trim()) {
      alert("First name is required");
      return;
    }

    if (!/^[A-Za-z]+$/.test(lastName.trim())) {
      alert("Last name should contain only alphabets");
      return;
    }

    if (
      !/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dateOfBirth)
    ) {
      alert("Invalid date format. Use MM/DD/YYYY");
      return;
    }

    const formData = new FormData();
    console.log("profileImage", profileImage);

    if (profileImage) {
      try {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        formData.append("image", blob, "profile.jpg");
      } catch (error) {
        console.error("Image fetch error:", error);
        alert("Failed to process the profile image.");
        return;
      }
    }

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("dateOfBirth", dateOfBirth);

    try {
      const response = await UserAPI.userEditProfile(user?.phone, formData);
      console.log("Profile updated successfully:", response?.data);
      if (response?.data) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
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
      console.error("Profile update failed:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <View style={globalStyles.container as ViewStyle}>
      <Header headerText="Edit Profile" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {/* Profile Picture */}
          <View style={globalStyles.profilePictureContainer}>
            <Image
              source={{ uri: profileImage }}
              style={globalStyles.profileImage}
            />
            <TouchableOpacity
              style={styles.changePictureButton}
              onPress={pickImage}
            >
              <Feather name="camera" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.changePictureText} onPress={takePhoto}>
              Change Profile Picture
            </Text>
          </View>
          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="user-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>First Name</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="First Name"
                value={firstName}
                onPress={() => {}}
                setValue={setFirstName}
                onChangeText={(text: any) => setFirstName(text)}
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="user-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Last Name</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Last Name"
                value={lastName}
                onPress={() => {}}
                setValue={setLastName}
                onChangeText={(text: any) => setLastName(text)}
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="calendar-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Date of Birth</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="--/--/----"
                value={dateOfBirth ? dateOfBirth.split("T")[0] : ""}
                onPress={() => {}}
                setValue={setDateOfBirth}
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="phone"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Phone</Text>
              <CustomTextInput
                disabled={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="phone number"
                value={user ? user.phone : phone}
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
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Email</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="email"
                disabled={true}
                value={user ? user.email : email}
                onPress={() => {}}
                setValue={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
          {/* <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="envelope-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Role</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Role"
                //disabled={true}
                value={role}
                onPress={() => {}}
                setValue={setRole}
                //keyboardType="email-address"
              />
            </View>
          </View> */}
        </View>
      </ScrollView>
      <View style={[globalStyles.p_3]}>
        <Button title="Save" onPress={handleEditProfile} />
      </View>
    </View>
  );
};

export default editProfileScreen;
