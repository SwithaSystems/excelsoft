import {
  DATE_FORMAT_Display,
  EDIT_PROFILE_SCREEN_TITLE,
  MINIMUM_USER_AGE,
} from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import Header from "../../components/Header";
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
  DeviceEventEmitter,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Image } from "react-native";
import styles from "./EditProfileStyles";
import colors from "../../../constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { UserAPI } from "@/services/userService";
import { Text } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setUserData } from "@/store/slices/userSlice";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showErrorAlert } from "../../../utilities/showErrorAlert";
import {
  FAILED_TO_UPDATE_DETAILS,
  CAMERA_ACCESS_REQUIRED,
  GALLERY_ACCESS_REQUIRED,
} from "../../../constants/customErrorMessages";
import { format } from "date-fns";
import { isValidName } from "@/utilities/validations";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { useNavigation } from "@react-navigation/native";

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

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  // Confirmation Modal States
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={EDIT_PROFILE_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  useEffect(() => {
    const getUser = async () => {
      if (userData) {
        const user = await UserAPI.getUserById(
          userData?._id ? userData?._id : userData?.id
        );
        if (user) {
          setUser(user.data);
          setFirstName(user?.data?.firstName);
          setLastName(user?.data?.lastName);
          setPhone(user?.data?.phone);
          setEmail(user.data?.email || "No mail added");
          setProfileImage(user.data.profileImageUrl);

          if (user.data.dateOfBirth) {
            const date = new Date(user.data.dateOfBirth);
            const formatted = format(date, DATE_FORMAT_Display);
            setDateOfBirth(formatted);
            setSelectedDate(formatted);
          }
        }
      }
    };
    getUser();
  }, [userData]);

  const validateFirstName = (name: string) => {
    const error = isValidName(name);
    setFirstNameError(error);
    return !error;
  };

  const validateLastName = (name: string) => {
    const error = isValidName(name);
    setLastNameError(error);
    return !error;
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (firstNameError) setFirstNameError(null);
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (lastNameError) setLastNameError(null);
  };

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

      if (!result.canceled && "assets" in result && result.assets?.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      showErrorAlert({
        title: "Image Error",
        message: "Something went wrong while picking the image.",
      });
    }
  };

  const showImageOptions = () => {
    Alert.alert("Select Image", "Choose image source", [
      { text: "Take Photo", onPress: () => openImagePickerAsync("camera") },
      { text: "Choose from Gallery", onPress: () => openImagePickerAsync("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const getMaximumDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - MINIMUM_USER_AGE,
      today.getMonth(),
      today.getDate()
    );
    return maxDate;
  };

  const handleEditProfile = async () => {
    setFirstNameError(null);
    setLastNameError(null);

    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    if (!isFirstNameValid || !isLastNameValid) return;

    const formData = new FormData();
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

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("dateOfBirth", dateOfBirth);

    try {
      setLoading(true);
      const response = await UserAPI.userEditProfile(user?._id, formData);
      if (response?.data) {
        DeviceEventEmitter.emit("fetchUser");
        await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
        dispatch(setUserData(response.data.user));
        setIsSuccessModalVisible(true);
      }
      return response?.data;
    } catch (error) {
      setIsErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
    // Go back to previous screen in navigation stack
    if (navigation) {
      navigation.goBack();
    } else {
      redirectToPage(containers.userProfileScreen);
    }
  };

  const handleErrorModalClose = () => {
    setIsErrorModalVisible(false);
    // Go back to previous screen in navigation stack
    if (navigation) {
      navigation.goBack();
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const uponDateSelection = (date: Date) => {
    const formatted = format(date, DATE_FORMAT_Display);
    setSelectedDate(formatted);
    setDateOfBirth(formatted);
    hideDatePicker();
  };

  const parsedDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  return (
    <LayoutComponent
      scrollable={true}
      hasHeader
      hasFooter={isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
      userSidebar={true}
    >
      <KeyBoardWrapper>
        <View
          style={[
            globalStyles.container as ViewStyle,
            isWeb && webStyles.contentWidth,
          ]}
        >
          <ScrollView>
            <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
              {/* Profile Picture */}
              <View style={globalStyles.profilePictureContainer}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("@/assets/default_user_profile.png")
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

              {/* First Name */}
              <View style={globalStyles.profileInputContainer}>
                <FontAwesome
                  name="user-o"
                  size={32}
                  style={globalStyles.userInputLabelIcon}
                />
                <View style={{ flex: 1, paddingLeft: 14 }}>
                  <Text style={globalStyles.userInputLabel}>First Name</Text>
                  <CustomTextInput
                    containerStyle={
                      firstNameError
                        ? { ...globalStyles.userInputContainer, borderColor: "red", borderWidth: 1 }
                        : globalStyles.userInputContainer
                    }
                    TextStyle={globalStyles.input}
                    placeholder="First Name"
                    value={firstName}
                    onPress={() => {}}
                    setValue={setFirstName}
                    onChangeText={handleFirstNameChange}
                  />
                  {firstNameError && (
                    <Text style={globalStyles.errorText}>{firstNameError}</Text>
                  )}
                </View>
              </View>

              {/* Last Name */}
              <View style={globalStyles.profileInputContainer}>
                <FontAwesome
                  name="user-o"
                  size={32}
                  style={globalStyles.userInputLabelIcon}
                />
                <View style={{ flex: 1, paddingLeft: 14 }}>
                  <Text style={globalStyles.userInputLabel}>Last Name</Text>
                  <CustomTextInput
                    containerStyle={
                      lastNameError
                        ? { ...globalStyles.userInputContainer, borderColor: "red", borderWidth: 1 }
                        : globalStyles.userInputContainer
                    }
                    TextStyle={globalStyles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onPress={() => {}}
                    setValue={setLastName}
                    onChangeText={handleLastNameChange}
                  />
                  {lastNameError && (
                    <Text style={globalStyles.errorText}>{lastNameError}</Text>
                  )}
                </View>
              </View>

              {/* Date of Birth */}
              <View style={globalStyles.profileInputContainer}>
                <FontAwesome
                  name="calendar-o"
                  size={32}
                  style={globalStyles.userInputLabelIcon}
                />
                <View style={{ flex: 1, paddingLeft: 14 }}>
                  <Text style={globalStyles.userInputLabel}>Date of Birth</Text>

                  {isWeb ? (
                    <input
                      type="date"
                      value={
                        selectedDate
                          ? format(parsedDate(selectedDate), "yyyy-MM-dd")
                          : ""
                      }
                      max={format(getMaximumDate(), "yyyy-MM-dd")}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const [year, month, day] = val.split("-");
                          const formatted = `${day}/${month}/${year}`;
                          setDateOfBirth(formatted);
                          setSelectedDate(formatted);
                        }
                      }}
                      style={{
                        width: "98%",
                        height: 40,
                        borderColor: colors.darkGray,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 10,
                        fontSize: 16,
                        backgroundColor: colors.lightgrey,
                      }}
                    />
                  ) : (
                    <TouchableOpacity onPress={showDatePicker}>
                      <TextInput
                        style={[globalStyles.input, { backgroundColor: colors.lightgrey, height: 40 }]}
                        placeholder="--/--/----"
                        value={dateOfBirth}
                        editable={false}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {isWeb ? (
          <View style={webStyles.buttonRow}>
            <Button
              primary={false}
              title="Cancel"
              onPress={() => redirectToPage(containers.homeScreen)}
              style={webStyles.buttonHalf}
            />
            <Button
              onPress={handleEditProfile}
              title="Save"
              style={webStyles.buttonHalf}
            />
          </View>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Button onPress={handleEditProfile} title="Save" />
          </View>
        )}

        {!isWeb && (
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            maximumDate={getMaximumDate()}
            date={selectedDate ? parsedDate(selectedDate) : new Date()}
            onConfirm={uponDateSelection}
            onCancel={hideDatePicker}
          />
        )}

        {/* Success Modal */}
        <ConfirmationModal
          isModalVisible={isSuccessModalVisible}
          onClose={handleSuccessModalClose}
          title="Success"
          text="Profile updated successfully."
          submitText="OK"
          handleSubmit={handleSuccessModalClose}
        />

        {/* Error Modal */}
        <ConfirmationModal
          isModalVisible={isErrorModalVisible}
          onClose={handleErrorModalClose}
          title="Update Failed"
          text={FAILED_TO_UPDATE_DETAILS}
          submitText="OK"
          handleSubmit={handleErrorModalClose}
        />
      </KeyBoardWrapper>
    </LayoutComponent>
  );
};

export default editProfileScreen;

const webStyles = StyleSheet.create({
  contentWidth: {
    width: "70%",
    alignSelf: "center",
  },
  buttonRow: {
    width: "70%",
    alignSelf: "center",
    flexDirection: "row",
    columnGap: 16,
  },
  buttonHalf: {
    flex: 1,
  },
});