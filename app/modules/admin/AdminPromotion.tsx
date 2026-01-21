import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Platform,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/Header";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import colors from "../../../constants/colors";
import styles from "./AdminPromotionStyles";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import PromotionCard from "@/app/components/PromotionCard";

interface Promotion {
  id: string;
  title: string;
  url: string;
  image: string | number;
  isLive: boolean;
}

const AdminPromotion = () => {
  const dummyPromotions: Promotion[] = [
    {
      id: "1",
      title: "Summer Savings Sale",
      url: "https://your-promo.com/summer-sale",
      image: require("../../../assets/Placeholder.png"),
      isLive: false,
    },
    {
      id: "2",
      title: "Weekend Saving Sale",
      url: "https://your-promo.com/summer-sale",
      image: require("../../../assets/Placeholder.png"),
      isLive: false,
    },
  ];

  const [promotionImage, setPromotionImage] = useState<string | null>(null);
  const [promotionTitle, setPromotionTitle] = useState("");
  const [promotionUrl, setPromotionUrl] = useState("");
  const [livePromotions, setLivePromotions] = useState<Promotion[]>(
    dummyPromotions.map((p) => ({ ...p, isLive: true }))
  );
  const [savedPromotions, setSavedPromotions] = useState<Promotion[]>(
    dummyPromotions
  );

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

  const handleAddPromotion = () => {
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

    const newPromotion: Promotion = {
      id: Date.now().toString(),
      title: promotionTitle,
      url: promotionUrl,
      image: promotionImage,
      isLive: true,
    };

    setLivePromotions([...livePromotions, newPromotion]);
    handleResetPromotion();
    Alert.alert("Success", "Promotion added successfully");
  };

  const handleResetPromotion = () => {
    setPromotionImage(null);
    setPromotionTitle("");
    setPromotionUrl("");
  };

  const handleRemoveLive = (id: string) => {
    Alert.alert(
      "Remove Live Promotion",
      "Are you sure you want to remove this promotion from live?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const promotion = livePromotions.find((p) => p.id === id);
            if (promotion) {
              setLivePromotions(livePromotions.filter((p) => p.id !== id));
              setSavedPromotions([...savedPromotions, { ...promotion, isLive: false }]);
            }
          },
        },
      ]
    );
  };

  const handleDeleteSaved = (id: string) => {
    Alert.alert(
      "Delete Promotion",
      "Are you sure you want to delete this promotion?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSavedPromotions(savedPromotions.filter((p) => p.id !== id));
          },
        },
      ]
    );
  };

  const handleEditPromotion = (promotion: Promotion) => {
    const imageValue = typeof promotion.image === "string" ? promotion.image : null;
    setPromotionImage(imageValue);
    setPromotionTitle(promotion.title);
    setPromotionUrl(promotion.url);
    if (promotion.isLive) {
      setLivePromotions(livePromotions.filter((p) => p.id !== promotion.id));
    } else {
      setSavedPromotions(savedPromotions.filter((p) => p.id !== promotion.id));
    }
  };

  const renderLivePromotionCard = ({ item }: { item: Promotion }) => (
    <View style={{ width: 280, marginRight: 16 }}>
      <PromotionCard
        image={item.image}
        title={item.title}
        url={item.url}
        showTitle={false}
        showLink={false}
        showEditButton={true}
        showDeleteButton={true}
        deleteButtonText="Remove Live"
        backgroundColor={colors.white}
        onEdit={() => handleEditPromotion(item)}
        onDelete={() => handleRemoveLive(item.id)}
      />
    </View>
  );

  const renderSavedPromotionCard = ({ item }: { item: Promotion }) => (
    <PromotionCard
      image={item.image}
      title={item.title}
      url={item.url}
      showTitle={true}
      showLink={true}
      showEditButton={true}
      showDeleteButton={true}
      onEdit={() => handleEditPromotion(item)}
      onDelete={() => handleDeleteSaved(item.id)}
    />
  );

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="Promotional Slides" />
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
        {/* Add New Promotion Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Promotion</Text>

          {/* Image Upload Area */}
          <TouchableOpacity
            style={styles.imageUploadArea}
            onPress={openImagePicker}
            activeOpacity={0.7}
          >
            {promotionImage ? (
              <Image
                source={{ uri: promotionImage }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={colors.primary}
                />
                <Text style={styles.placeholderText}>Add Image here</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Add Promotional Slide Title</Text>
            <CustomTextInput
              placeholder="e.g., Summer Sale Bonanza"
              value={promotionTitle}
              setValue={setPromotionTitle}
              style={styles.textInput}
              onPress={() => {}}
            />
          </View>

          {/* URL Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter Promotional URL</Text>
            <CustomTextInput
              placeholder="https://your-promo.com/summer-sale"
              value={promotionUrl}
              setValue={setPromotionUrl}
              style={styles.textInput}
              keyboardType="url"
              onPress={() => {}}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddPromotion}
            >
              <Text style={styles.addButtonText}>Add Promotion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleResetPromotion}
            >
              <Text style={styles.resetButtonText}>Reset Promotion</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Promotions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Promotions</Text>
          {livePromotions.length > 0 ? (
            <FlatList
              data={livePromotions}
              renderItem={renderLivePromotionCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No live promotions</Text>
            </View>
          )}
        </View>

        {/* Saved Promotions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Promotions</Text>
          {savedPromotions.length > 0 ? (
            <FlatList
              data={savedPromotions}
              renderItem={renderSavedPromotionCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No saved promotions</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LayoutComponent>
  );
};

export default AdminPromotion;

