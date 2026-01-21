import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import Header from "../../components/Header";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import colors from "../../../constants/colors";
import styles from "./EditPromotionStyles";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import Button from "@/app/components/commonComponents/Button";

const EditPromotion = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const promotionData = params.promotion ? JSON.parse(params.promotion as string) : null;

  const [promotionImage, setPromotionImage] = useState<string | number | null>(
    promotionData?.image || null
  );
  const [promotionTitle, setPromotionTitle] = useState(
    promotionData?.title || ""
  );
  const [promotionUrl, setPromotionUrl] = useState(
    promotionData?.url || ""
  );
  const [startingDate, setStartingDate] = useState<string>(
    promotionData?.startingDate || ""
  );
  const [endingDate, setEndingDate] = useState<string>(
    promotionData?.endingDate || ""
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const isWeb = Platform.OS === "web";

  const openImagePicker = useCallback(async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPromotionImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  }, []);

  const handleSavePromotion = () => {
    if (!promotionImage) {
      Alert.alert("Error", "Please add an image");
      return;
    }
    if (!promotionTitle.trim()) {
      Alert.alert("Error", "Please enter a promotional slide title");
      return;
    }
    if (!promotionUrl.trim()) {
      Alert.alert("Error", "Please enter a promotional URL");
      return;
    }

    // TODO: Save promotion logic here
    Alert.alert("Success", "Promotion saved successfully", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleDeletePromotion = () => {
    Alert.alert(
      "Delete Promotion",
      "Are you sure you want to delete this promotion?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Delete promotion logic here
            Alert.alert("Success", "Promotion deleted successfully", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          },
        },
      ]
    );
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getMinEndDate = () => {
    if (startingDate) {
      const start = new Date(startingDate);
      start.setDate(start.getDate() + 1);
      return start;
    }
    return getTodayDate();
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    if (Platform.OS === "web") {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="Edit Promotion" />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="home" />;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isWeb}
      scrollable={isWeb ? true : false}
      hideNavItems={true}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Promotion Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promotion Image</Text>
          {promotionImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={
                  typeof promotionImage === "string"
                    ? { uri: promotionImage }
                    : promotionImage
                }
                style={styles.imagePreview}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={48}
                color={colors.placeholdergrey}
              />
            </View>
          )}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={openImagePicker}
            activeOpacity={0.7}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={colors.white} />
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Add Promotional Slide Title</Text>
          <CustomTextInput
            placeholder="Enter Promotional Slide title"
            value={promotionTitle}
            setValue={setPromotionTitle}
            style={styles.textInput}
            onPress={() => {}}
          />
        </View>

        {/* URL Input */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Enter Promotional URL</Text>
          <CustomTextInput
            placeholder="Enter your promotional url"
            value={promotionUrl}
            setValue={setPromotionUrl}
            style={styles.textInput}
            keyboardType="url"
            onPress={() => {}}
          />
        </View>

        {/* Date Range Selection */}
        <View style={styles.dateRangeContainer}>
          <View style={styles.dateInputWrapper}>
            <Text style={styles.dateLabel}>Starting From</Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                style={styles.webDateInput}
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                min={formatDateForInput(getTodayDate())}
              />
            ) : (
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateInputText}>
                  {startingDate ? formatDateForDisplay(startingDate) : "Select date"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dateInputWrapper}>
            <Text style={styles.dateLabel}>Ending On</Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                style={styles.webDateInput}
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                min={formatDateForInput(getMinEndDate())}
              />
            ) : (
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateInputText}>
                  {endingDate ? formatDateForDisplay(endingDate) : "Select date"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSavePromotion}
          >
            <Text style={styles.saveButtonText}>Save Promotion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePromotion}
          >
            <Text style={styles.deleteButtonText}>Delete Promotion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Pickers for Mobile */}
      {!isWeb && (
        <>
          <DateTimePickerModal
            isVisible={showStartDatePicker}
            mode="date"
            onConfirm={(selectedDate) => {
              setShowStartDatePicker(false);
              setStartingDate(formatDateForInput(selectedDate));
              // If ending date is before new start date, clear it
              if (endingDate && new Date(endingDate) <= selectedDate) {
                setEndingDate("");
              }
            }}
            onCancel={() => setShowStartDatePicker(false)}
            minimumDate={getTodayDate()}
          />
          <DateTimePickerModal
            isVisible={showEndDatePicker}
            mode="date"
            onConfirm={(selectedDate) => {
              setShowEndDatePicker(false);
              const minDate = getMinEndDate();
              if (selectedDate >= minDate) {
                setEndingDate(formatDateForInput(selectedDate));
              } else {
                Alert.alert("Invalid Date", "Ending date must be after the starting date");
              }
            }}
            onCancel={() => setShowEndDatePicker(false)}
            minimumDate={getMinEndDate()}
          />
        </>
      )}
    </LayoutComponent>
  );
};

export default EditPromotion;

