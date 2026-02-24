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
import {
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
  DeviceEventEmitter,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
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
import { color } from "react-native-elements/dist/helpers";
import React, { useEffect, useState, useRef } from "react";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";

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
  const { showAlert, confirmationModal } = useConfirmationAlert();
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
  const [profileLoading, setProfileLoading] = useState(true);
  const dispatch = useDispatch();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  // Confirmation Modal States
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorModalState, setErrorModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;
  const showErrorAlert = ({
    title,
    message,
    buttonLabel = "OK",
  }: {
    title: string;
    message: string;
    buttonLabel?: string;
  }) => {
    setErrorModalState({
      isVisible: true,
      title,
      message,
      buttonLabel,
    });
  };

  const webImageFileRef = useRef<File | null>(null);


  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={EDIT_PROFILE_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  useEffect(() => {
    const getUser = async () => {
      if (!userData) {
        setProfileLoading(false);
        return;
      }

      try {
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setProfileLoading(false);
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

  const handleWebImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  webImageFileRef.current = file; 
  setProfileImage(URL.createObjectURL(file));
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
    showAlert("Select Image", "Choose image source", [
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
    if (isWeb && webImageFileRef.current) {
  formData.append("image", webImageFileRef.current);
} else if (
  profileImage &&
  typeof profileImage === "string" &&
  profileImage.startsWith("file://")
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
        dispatch(
          setUserData({
            ...response.data.user,
            profileImageUrl:
              response.data.user.profileImageUrl ||
              response.data.user.profileImage ||
              response.data.user.image ||
              "",
          })
        );
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
  const handleFirstNameBlur = () => {
     if (firstName.trim()) {
       validateFirstName(firstName);
     }
   };

   const handleLastNameBlur = () => {
     if (lastName.trim()) {
       validateLastName(lastName);
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

  if (profileLoading) {
    return (
      <LayoutComponent
        hasHeader
        hasFooter={isWeb}
        headerComponent={HeaderComponent}
        footerComponent={FooterComponent || undefined}
        hasSidebar={isWeb}
        userSidebar={true}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </LayoutComponent>
    );
  }

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
            isMobileWeb && webStyles.mobileWebContentWidth,
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
                 style={[
                    globalStyles.profileImage,
                    isMobileWeb && webStyles.mobileWebProfileImage,
                  ]}
                />
               {isWeb ? (
  <label style={{ cursor: "pointer" }}>
    <Feather name="camera" size={24} color={colors.primary} />
    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handleWebImagePick}
    />
  </label>
) : (
  <TouchableOpacity
    style={styles.changePictureButton}
    onPress={showImageOptions}
  >
    <Feather name="camera" size={24} color={colors.primary} />
  </TouchableOpacity>
)}

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
                    onblur={handleFirstNameBlur}
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
                    onblur={handleLastNameBlur}
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
              {isWeb && (
                <View
                style={[
                  webStyles.inlineButtonRow,
                  isMobileWeb && webStyles.mobileWebInlineButtonRow,
                ]}
              >
                  <Button
                    primary={false}
                    title="Cancel"
                    onPress={() => redirectToPage(containers.homeScreen)}
                    style={[
                      webStyles.cancelButton,
                      isMobileWeb && webStyles.mobileWebButton,
                    ]}
                    textStyle={webStyles.cancelButtonText}
                  />
                  <Button
                    title={loading ? "Saving..." : "Save"}
                    onPress={handleEditProfile}
                    style={[
                      webStyles.saveButton,
                      loading && { opacity: 0.6 },
                      isMobileWeb && webStyles.mobileWebButton,
                    ]}
                    textStyle={webStyles.saveButtonText}
                  />
                </View>
              )}

            </View>
          </ScrollView>
        </View>

          {!isWeb && (
          <View style={{ marginTop: 16 }}>
            <Button onPress={handleEditProfile} title={loading ? "Saving..." : "Save"}
  disabled={loading} />
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
        <ConfirmationModal
          isModalVisible={errorModalState.isVisible}
          onClose={() =>
            setErrorModalState((prev) => ({ ...prev, isVisible: false }))
          }
          title={errorModalState.title}
          text={errorModalState.message}
          submitText={errorModalState.buttonLabel}
          handleSubmit={() =>
            setErrorModalState((prev) => ({ ...prev, isVisible: false }))
          }
        />
        {confirmationModal}
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
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 32,
    marginBottom: 40,
  },

  inlineButtonRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  mobileWebProfileImage: {
    width: 90,
    height: 90,
  },
  saveButton: {
    minWidth: 160,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  cancelButton: {
    minWidth: 140,
    height: 44,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "500",
  },

  mobileWebContentWidth: {
    width: "94%",
    alignSelf: "center",
  },

  mobileWebInlineButtonRow: {
    flexDirection: "column",
    gap: 12,
  },

  mobileWebButton: {
    width: "100%",
    minWidth: undefined,
  },

});
