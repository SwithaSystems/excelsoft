import React, { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
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
  Modal,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import Header from "../../components/Header";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import colors from "../../../constants/colors";
import styles from "./AdminPromotionStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import PromotionCard from "@/app/components/PromotionCard";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Product, ProductsAPI } from "@/services/productService";
import SearchBar from "@/app/components/searchBar";
import { categoryService } from "@/services/categoryService";
import useDebounce from "@/utilities/customHooks/useDebounce";
import { promotionService, Promotion as APIPromotion } from "@/services/promotionService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";

interface Promotion {
  id: string;
  title: string;
  url: string;
  image: string | number;
  isLive: boolean;
  _id?: string;
}

const AdminPromotion = () => {
  const params = useLocalSearchParams();
  
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
  const [startingDate, setStartingDate] = useState<string>("");
  const [endingDate, setEndingDate] = useState<string>("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [attachedProducts, setAttachedProducts] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productDisplayMode, setProductDisplayMode] = useState<"category" | "product">("product");
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const debouncedProductQuery = useDebounce(productSearchQuery, 300);
  const [livePromotions, setLivePromotions] = useState<Promotion[]>([]);
  const [savedPromotions, setSavedPromotions] = useState<Promotion[]>(dummyPromotions);
  const [isLoadingLivePromotions, setIsLoadingLivePromotions] = useState(false);
  const [isSavingPromotion, setIsSavingPromotion] = useState(false);
  const [showRemoveLiveModal, setShowRemoveLiveModal] = useState(false);
  const [promotionToRemoveLive, setPromotionToRemoveLive] = useState<Promotion | null>(null);

  const isWeb = Platform.OS === "web";

  const renderCategoryItems = () => (
    <>
      {allCategories.map((cat: any) => (
        <TouchableOpacity
          key={cat.id || cat._id}
          style={styles.dropdownItem as ViewStyle}
          onPress={() => {
            setSelectedCategory(cat.id || cat._id);
            setIsCategoryOpen(false);
          }}
        >
          <Text style={styles.dropdownItemText as TextStyle}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  const fetchAvailableProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const response = await ProductsAPI.getAllProducts(1, 100);
      setAvailableProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const handleSelectProducts = useCallback(() => {
    setShowProductModal(true);
    setProductSearchQuery("");
    if (availableProducts.length === 0) {
      fetchAvailableProducts();
    }
  }, [availableProducts.length, fetchAvailableProducts]);

  const searchProductsByName = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchAvailableProducts();
      return;
    }
    try {
      setIsLoadingProducts(true);
      const response = await ProductsAPI.productsBy_Name_Id(query.trim());
      if (response) {
        setAvailableProducts(response);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      Alert.alert("Error", "Failed to search products");
    } finally {
      setIsLoadingProducts(false);
    }
  }, [fetchAvailableProducts]);

  const handleProductSearch = useCallback(async () => {
    await searchProductsByName(productSearchQuery);
  }, [productSearchQuery, searchProductsByName]);

  useEffect(() => {
    if (showProductModal) {
      searchProductsByName(debouncedProductQuery);
    }
  }, [debouncedProductQuery, showProductModal, searchProductsByName]);

  const fetchLivePromotions = useCallback(async () => {
    try {
      setIsLoadingLivePromotions(true);
      const apiPromotions = await promotionService.getAllPromotions();
      
      // Convert API promotions to local Promotion format
      const convertedPromotions: Promotion[] = apiPromotions.map((promo: APIPromotion) => ({
        id: promo._id || Date.now().toString(),
        _id: promo._id,
        title: promo.title,
        url: promo.link,
        image: promo.imageURL,
        isLive: true,
      }));
      
      setLivePromotions(convertedPromotions);
    } catch (error) {
      console.error("Error fetching live promotions:", error);
      // Don't show alert, just log the error
    } finally {
      setIsLoadingLivePromotions(false);
    }
  }, []);

  useEffect(() => {
    fetchLivePromotions();
  }, [fetchLivePromotions]);

  // Refresh live promotions when screen comes into focus (after navigating back from edit)
  useFocusEffect(
    useCallback(() => {
      fetchLivePromotions();
    }, [fetchLivePromotions])
  );

  // Handle new saved promotion from EditPromotion screen
  useEffect(() => {
    if (params.newSavedPromotion) {
      try {
        const newPromotion = JSON.parse(params.newSavedPromotion as string);
        setSavedPromotions((prev) => {
          // Check if promotion already exists to avoid duplicates
          const exists = prev.some((p) => p.id === newPromotion.id);
          if (exists) return prev;
          return [...prev, newPromotion];
        });
      } catch (error) {
        console.error("Error parsing new saved promotion:", error);
      }
    }
  }, [params.newSavedPromotion]);

  // Handle updated saved promotion from EditPromotion screen
  useEffect(() => {
    if (params.updatedSavedPromotion) {
      try {
        const updatedPromotion = JSON.parse(params.updatedSavedPromotion as string);
        setSavedPromotions((prev) => {
          // Update existing promotion or add if it doesn't exist
          const index = prev.findIndex((p) => p.id === updatedPromotion.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = updatedPromotion;
            return updated;
          }
          return [...prev, updatedPromotion];
        });
      } catch (error) {
        console.error("Error parsing updated saved promotion:", error);
      }
    }
  }, [params.updatedSavedPromotion]);

  // Handle deleted saved promotion from EditPromotion screen
  useEffect(() => {
    if (params.deletedPromotionId) {
      const deletedId = params.deletedPromotionId as string;
      setSavedPromotions((prev) => prev.filter((p) => p.id !== deletedId));
    }
  }, [params.deletedPromotionId]);

  const handleAddProduct = useCallback((product: Product) => {
    setAttachedProducts((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === (product._id || product.id));
      if (exists) return prev;
      return [...prev, product];
    });
  }, []);

  const handleRemoveProduct = useCallback((productId: string) => {
    setAttachedProducts((prev) =>
      prev.filter((p) => (p._id || p.id) !== productId)
    );
  }, []);

  const handleToggleProductAttachment = useCallback((product: Product) => {
    const isAttached = attachedProducts.some(
      (p) => (p._id || p.id) === (product._id || product.id)
    );
    if (isAttached) {
      handleRemoveProduct(String(product._id || product.id));
    } else {
      handleAddProduct(product);
    }
  }, [attachedProducts, handleAddProduct, handleRemoveProduct]);

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
      isLive: false,
    };

    setSavedPromotions([...savedPromotions, newPromotion]);
    handleResetPromotion();
    Alert.alert("Success", "Promotion saved successfully");
  };


  const handleResetPromotion = () => {
    setPromotionImage(null);
    setPromotionTitle("");
    setPromotionUrl("");
    setStartingDate("");
    setEndingDate("");
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

  const handleRemoveLiveClick = (id: string) => {
    const promotion = livePromotions.find((p) => p.id === id);
    if (promotion) {
      setPromotionToRemoveLive(promotion);
      setShowRemoveLiveModal(true);
    }
  };

  const confirmRemoveLive = async () => {
    if (!promotionToRemoveLive) return;

    try {
      const promotion = promotionToRemoveLive;
      if (promotion._id) {
        await promotionService.deletePromotion(promotion._id);
        // Move promotion from live to saved
        const updatedPromotion = { ...promotion, isLive: false, _id: undefined };
        setLivePromotions(livePromotions.filter((p) => p.id !== promotion.id));
        setSavedPromotions((prev) => {
          const exists = prev.some((p) => p.id === promotion.id);
          if (exists) return prev;
          return [...prev, updatedPromotion];
        });
        Alert.alert("Success", "Promotion removed from live");
      }
    } catch (error: any) {
      console.error("Error removing promotion from live:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to remove promotion from live");
    } finally {
      setShowRemoveLiveModal(false);
      setPromotionToRemoveLive(null);
    }
  };

  const handleGoLive = async (id: string) => {
    const promotion = savedPromotions.find((p) => p.id === id);
    if (!promotion) return;

    Alert.alert(
      "Go Live",
      "Are you sure you want to make this promotion live?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go Live",
          onPress: async () => {
            try {
              setIsSavingPromotion(true);
              
              // Determine if the link is internal or external
              const isInternalLink = !promotion.url.startsWith("http://") && !promotion.url.startsWith("https://");
              
              // Prepare image file for upload
              let imageFile: File | any;
              if (Platform.OS === "web") {
                if (typeof promotion.image === "string") {
                  if (promotion.image.startsWith("data:")) {
                    const response = await fetch(promotion.image);
                    const blob = await response.blob();
                    imageFile = new File([blob], "promotion-image.jpg", { type: blob.type });
                  } else if (promotion.image.startsWith("http://") || promotion.image.startsWith("https://")) {
                    const response = await fetch(promotion.image);
                    const blob = await response.blob();
                    imageFile = new File([blob], "promotion-image.jpg", { type: blob.type });
                  } else {
                    const response = await fetch(promotion.image);
                    const blob = await response.blob();
                    imageFile = new File([blob], "promotion-image.jpg", { type: blob.type });
                  }
                } else {
                  Alert.alert("Error", "Please select a new image for upload");
                  setIsSavingPromotion(false);
                  return;
                }
              } else {
                if (typeof promotion.image === "string") {
                  imageFile = {
                    uri: promotion.image,
                    type: "image/jpeg",
                    name: "promotion-image.jpg",
                  };
                } else {
                  Alert.alert("Error", "Please select a new image for upload");
                  setIsSavingPromotion(false);
                  return;
                }
              }

              await promotionService.createPromotion({
                title: promotion.title,
                link: promotion.url,
                isInternalLink: isInternalLink,
                image: imageFile,
              });

              // Remove from saved and refresh live promotions
              setSavedPromotions(savedPromotions.filter((p) => p.id !== id));
              fetchLivePromotions();
              Alert.alert("Success", "Promotion is now live!");
            } catch (error: any) {
              console.error("Error making promotion live:", error);
              Alert.alert("Error", error?.response?.data?.message || "Failed to make promotion live");
            } finally {
              setIsSavingPromotion(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteLive = async (id: string) => {
    Alert.alert(
      "Delete Promotion",
      "Are you sure you want to delete this live promotion?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const promotion = livePromotions.find((p) => p.id === id);
              if (promotion && promotion._id) {
                await promotionService.deletePromotion(promotion._id);
                // Remove from live promotions
                setLivePromotions(livePromotions.filter((p) => p.id !== id));
                fetchLivePromotions();
                Alert.alert("Success", "Promotion deleted successfully");
              }
            } catch (error: any) {
              console.error("Error deleting promotion:", error);
              Alert.alert("Error", error?.response?.data?.message || "Failed to delete promotion");
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
    redirectToPage(containers.EditPromotionScreen, {
      promotion: JSON.stringify(promotion),
    });
  };


  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="Promotional Slides" />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="home" />;

  // Combine live and saved promotions into one array
  // Live promotions first, then saved promotions - both will be displayed together
  const allPromotions = [...livePromotions, ...savedPromotions];

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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile: Add New Promotion Button */}
        {!isWeb && (
          <View style={styles.mobileButtonContainer as ViewStyle}>
            <TouchableOpacity
              style={styles.addNewButton as ViewStyle}
              onPress={() => {
                redirectToPage(containers.EditPromotionScreen, {
                  newPromotion: true,
                });
              }}
            >
              <Text style={styles.addNewButtonText as TextStyle}>+ Add New Promotion</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header with Title and Add Button */}
        <View style={styles.headerRow as ViewStyle}>
          {isWeb && (
            <Text style={styles.pageTitle as TextStyle}>Promotions</Text>
          )}
          {isWeb && (
            <TouchableOpacity
              style={styles.addNewButtonWeb as ViewStyle}
              onPress={() => {
                redirectToPage(containers.EditPromotionScreen, {
                  newPromotion: true,
                });
              }}
            >
              <Text style={styles.addNewButtonText as TextStyle}>+ Add New Promotion</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isWeb && (
          <Text style={styles.pageTitle as TextStyle}>Promotions</Text>
        )}

        {/* Combined Promotions List */}
        {isLoadingLivePromotions ? (
          <View style={styles.emptyState as ViewStyle}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.emptyStateText as TextStyle}>Loading promotions...</Text>
          </View>
        ) : allPromotions.length > 0 ? (
          isWeb ? (
            <View style={styles.gridContainer as ViewStyle}>
              {allPromotions.map((item, index) => {
                const isLive = item.isLive;
                return (
                  <View 
                    key={item.id} 
                    style={[
                      styles.gridCardWrapper as ViewStyle,
                      (index + 1) % 4 === 0 && { marginRight: 0 } as ViewStyle
                    ]}
                  >
                    <View style={styles.cardContainer as ViewStyle}>
                      {isLive && (
                        <View style={styles.liveBadge as ViewStyle}>
                          <View style={styles.liveDot as ViewStyle} />
                          <Text style={styles.liveBadgeText as TextStyle}>Live</Text>
                        </View>
                      )}
                      <PromotionCard
                        image={item.image}
                        title={item.title}
                        isLive={item.isLive}
                        onEdit={() => handleEditPromotion(item)}
                        onDelete={() =>
                          item.isLive
                            ? handleDeleteLive(item.id)
                            : handleDeleteSaved(item.id)
                        }
                        onRemoveLive={() => handleRemoveLiveClick(item.id)}
                        onGoLive={() => handleGoLive(item.id)}
                      />

                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View>
              {allPromotions.map((item) => {
                const isLive = item.isLive;
                return (
                  <View key={item.id} style={styles.mobileCardWrapper as ViewStyle}>
                    <View style={styles.cardContainer as ViewStyle}>
                      {isLive && (
                        <View style={styles.liveBadge as ViewStyle}>
                          <View style={styles.liveDot as ViewStyle} />
                          <Text style={styles.liveBadgeText as TextStyle}>Live</Text>
                        </View>
                      )}
                      <PromotionCard
                        image={item.image}
                        title={item.title}
                        isLive={item.isLive}
                        onEdit={() => handleEditPromotion(item)}
                        onDelete={() =>
                          item.isLive
                            ? handleDeleteLive(item.id)
                            : handleDeleteSaved(item.id)
                        }
                        onRemoveLive={() => handleRemoveLiveClick(item.id)}
                        onGoLive={() => handleGoLive(item.id)}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )
        ) : (
          <View style={styles.emptyState as ViewStyle}>
            <Text style={styles.emptyStateText as TextStyle}>No promotions found</Text>
          </View>
        )}
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

      {/* Product Selection Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay as ViewStyle}>
          <View style={styles.modalContent as ViewStyle}>
            <View style={styles.modalHeader as ViewStyle}>
              <Text style={styles.modalTitle as TextStyle}>Select Products</Text>
              <TouchableOpacity
                onPress={() => setShowProductModal(false)}
                style={styles.modalCloseButton as ViewStyle}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer as ViewStyle}>
              <SearchBar
                placeholder="Search by name..."
                value={productSearchQuery}
                onChangeText={setProductSearchQuery}
                onSubmitEditing={handleProductSearch}
                onPress={handleProductSearch}
              />
            </View>
            {isLoadingProducts ? (
              <View style={styles.modalLoadingContainer as ViewStyle}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 12 }}>Loading products...</Text>
              </View>
            ) : (
              <FlatList
                data={[...availableProducts].sort((a, b) => {
                  const aIsAttached = attachedProducts.some(
                    (p) => (p._id || p.id) === (a._id || a.id)
                  );
                  const bIsAttached = attachedProducts.some(
                    (p) => (p._id || p.id) === (b._id || b.id)
                  );
                  if (aIsAttached && !bIsAttached) return -1;
                  if (!aIsAttached && bIsAttached) return 1;
                  return 0;
                })}
                keyExtractor={(item) => String(item._id || item.id)}
                renderItem={({ item }) => {
                  const isAttached = attachedProducts.some(
                    (p) => (p._id || p.id) === (item._id || item.id)
                  );
                  const productImage = item.image?.[0] || item.image;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.productModalItem as ViewStyle,
                        isAttached && (styles.productModalItemSelected as ViewStyle),
                      ]}
                      onPress={() => handleToggleProductAttachment(item)}
                    >
                      <Image
                        source={
                          typeof productImage === "string"
                            ? { uri: productImage }
                            : productImage || require("../../../assets/Placeholder.png")
                        }
                        style={styles.productModalImage as ImageStyle}
                        resizeMode="cover"
                      />
                      <View style={styles.productModalInfo as ViewStyle}>
                        <Text style={styles.productModalName as TextStyle} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text style={styles.productModalSku as TextStyle}>
                          SKU: {item.id || item._id || "N/A"}
                        </Text>
                      </View>
                      {isAttached && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
                style={styles.modalList as ViewStyle}
              />
            )}
            <View style={styles.modalFooter as ViewStyle}>
              <TouchableOpacity
                style={styles.modalDoneButton as ViewStyle}
                onPress={() => setShowProductModal(false)}
              >
                <Text style={styles.modalDoneButtonText as TextStyle}>Select Products</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Remove Live Confirmation Modal */}
      <ConfirmationModal
        isModalVisible={showRemoveLiveModal}
        onClose={() => {
          setShowRemoveLiveModal(false);
          setPromotionToRemoveLive(null);
        }}
        handleCancel={() => {
          setShowRemoveLiveModal(false);
          setPromotionToRemoveLive(null);
        }}
        handleSubmit={confirmRemoveLive}
        title="Remove Live Promotion"
        text="Are you sure you want to remove this promotion from live?"
        submitText="Yes"
        cancelText="No"
      />
    </LayoutComponent>
  );
};

export default AdminPromotion;