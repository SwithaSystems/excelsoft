import { EDIT_PROFILE_SCREEN_TITLE } from "./../config/stringLiterals";
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
  SafeAreaView,
  DeviceEventEmitter,
  Platform,
  TextInput,
} from "react-native";
import { Image } from "react-native";
import styles from "./editProfileScreenStyles";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";
import { useDerivedValue } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAPI } from "@/services/userService";
import { Text } from "react-native-elements";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/userSlice";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatToDDMMYYYY } from "../config/dateTimeFormat";
import { showErrorAlert } from "../config/showErrorAlert";
import {
  FAILED_TO_UPDATE_DETAILS,
  CAMERA_ACCESS_REQUIRED,
  GALLERY_ACCESS_REQUIRED,
} from "../config/customErrorMessages";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Store Manager");
  const [profileImage, setProfileImage] = useState("");
  const [user, setUser] = useState<any>(null);
  const userData = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getUser = async () => {
      console.log("userData", userData?.id);
      if (userData) {
        const user = await UserAPI.getUserById(
          userData?._id ? userData?._id : userData?.id
        );
        console.log("user", user.data);
        if (user) {
          setUser(user.data);
          setFirstName(user?.data?.firstName);
          setLastName(user?.data?.lastName);
          setPhone(user?.data?.phone);
          setEmail(user.data?.email || "No mail added");
          setProfileImage(user.data.profileImageUrl);
          if (user.data.dateOfBirth) {
            const date = new Date(user.data.dateOfBirth);
            const formatted =
              String(date.getDate()).padStart(2, "0") +
              "/" +
              String(date.getMonth() + 1).padStart(2, "0") +
              "/" +
              date.getFullYear();
            setDateOfBirth(formatted);
            setSelectedDate(formatted);
          }
        }
      }
    };
    getUser();
  }, [userData]);

  const openImagePickerAsync = async (type: "camera" | "gallery") => {
    let result;

    try {
      if (type === "camera") {
        const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPerm.granted) {
          showErrorAlert({
            title: "Camera Permission",
            message: CAMERA_ACCESS_REQUIRED,
          });
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        const galleryPerm =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!galleryPerm.granted) {
          showErrorAlert({
            title: "Gallery Permission",
            message: GALLERY_ACCESS_REQUIRED,
          });
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      // ✅ Handle image result safely
      if (!result.canceled && "assets" in result && result.assets?.length > 0) {
        setProfileImage(result.assets[0].uri);
      } else {
        console.log("Image picking was cancelled or returned no assets.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showErrorAlert({
        title: "Image Error",
        message: "Something went wrong while picking the image.",
      });
    }
  };

  const showImageOptions = () => {
    Alert.alert("Select Image", "Choose image source", [
      {
        text: "Take Photo",
        onPress: () => openImagePickerAsync("camera"),
      },
      {
        text: "Choose from Gallery",
        onPress: () => openImagePickerAsync("gallery"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleEditProfile = async () => {
    if (!firstName.trim()) {
      showErrorAlert({
        title: "Missing Details",
        message: "First name is required.",
      });
      return;
    }

    if (!/^[A-Za-z]+$/.test(firstName.trim())) {
      showErrorAlert({
        title: "Invalid First Name",
        message: "First name should contain only alphabets.",
      });
      return;
    }

    if (!/^[A-Za-z]+$/.test(lastName.trim())) {
      showErrorAlert({
        title: "Invalid Last Name",
        message: "Last name should contain only alphabets.",
      });
      return;
    }

    const formData = new FormData();

    console.log("profileImage", profileImage);

    if (
      profileImage &&
      typeof profileImage === "string" &&
      (profileImage.startsWith("http") || profileImage.startsWith("file://"))
    ) {
      formData.append("image", {
        uri: profileImage,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    // These should work with any FormData implementation
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("dateOfBirth", dateOfBirth);

    console.log("formData", formData);
    console.log("user?.data?._id", user);

    try {
      setLoading(true);
      const response = await UserAPI.userEditProfile(user?._id, formData);
      console.log("Profile updated successfully:", response?.data);
      if (response?.data) {
        DeviceEventEmitter.emit("fetchUser");
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
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
      console.error("Profile update failed:", error);
      showErrorAlert({
        title: "Update Failed",
        message: FAILED_TO_UPDATE_DETAILS,
      });
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const uponDateSelection = (date: Date) => {
    const formatted = formatToDDMMYYYY(date);
    console.log("formatted", formatted);
    setSelectedDate(formatted);
    setDateOfBirth(formatted);
    hideDatePicker();
  };

  const parsedDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };


  return (
    <PageLayout
      scrollable={false}
      hasHeader
      hasFooter={false}
      headerComponent={<Header headerText={EDIT_PROFILE_SCREEN_TITLE} />}
    >
      <KeyBoardWrapper>
        <View style={globalStyles.container as ViewStyle}>
          {/* <Header headerText={EDIT_PROFILE_SCREEN_TITLE} /> */}
          <ScrollView>
            <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
              {/* Profile Picture */}
              <View style={globalStyles.profilePictureContainer}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("../../assets/default_user_profile.png")
                  }
                  style={globalStyles.profileImage}
                />
                <TouchableOpacity
                  style={styles.changePictureButton}
                  onPress={showImageOptions}
                >
                  <Feather name="camera" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.changePictureText}>
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
                  <TouchableOpacity onPress={showDatePicker}>
                    <TextInput
                      style={globalStyles.input}
                      placeholder="--/--/----"
                      value={dateOfBirth}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View>
          <Button onPress={handleEditProfile} title="Save" />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          maximumDate={new Date()}
          date={selectedDate ? parsedDate(selectedDate) : new Date()}
          onConfirm={uponDateSelection}
          onCancel={hideDatePicker}
        />
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default editProfileScreen;
