import React, { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import colors from "../../../constants/colors";
import styles from "./AdminPromotionStyles";
import PromotionCard from "@/app/components/PromotionCard";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { promotionService, Promotion as APIPromotion } from "@/services/promotionService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { showAlert } from "@/utilities/alertHelper";

// Utility functions
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  try {
    // Remove any existing time component
    const dateOnly = dateString.split("T")[0];
    const date = new Date(dateOnly + "T00:00:00.000Z");
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    return "";
  } catch {
    return "";
  }
};

const getDefaultEndDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
};

const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

const isInternalLink = (url: string): boolean => {
  return !url.startsWith("http://") && !url.startsWith("https://");
};

const getProductImage = (image: any): any => {
  if (!image) return require("../../../assets/Placeholder.png");
  
  if (Array.isArray(image)) {
    return image.length > 0 && image[0] 
      ? (typeof image[0] === "string" ? { uri: image[0] } : image[0])
      : require("../../../assets/Placeholder.png");
  }
  
  return typeof image === "string" ? { uri: image } : image;
};

// Check if today's date is within the promotion date range (inclusive)
const isDateInRange = (startDate?: string, endDate?: string): boolean => {
  if (!startDate || !endDate) return false;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const start = new Date(startDate.split("T")[0]);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate.split("T")[0]);
    end.setHours(0, 0, 0, 0);
    
    // Check if today is >= start date AND <= end date (inclusive)
    return today >= start && today <= end;
  } catch (error) {
    console.error("Error checking date range:", error);
    return false;
  }
};

// Interfaces
interface Promotion {
  id: string;
  title: string;
  url: string;
  image: string | number;
  isLive: boolean;
  _id?: string;
  startingDate?: string;
  endingDate?: string;
  attachedProducts?: any[];
}

interface PromotionUpdateData {
  title: string;
  link: string;
  isInternalLink: boolean;
  isLive: boolean;
  startDate: string;
  endDate: string;
  products ?: string[];
}

const AdminPromotion = () => {
  const params = useLocalSearchParams();
  
  // State management
  const [livePromotions, setLivePromotions] = useState<Promotion[]>([]);
  const [savedPromotions, setSavedPromotions] = useState<Promotion[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  const [errorLoadingPromotions, setErrorLoadingPromotions] = useState<string | null>(null);
  
  // Modal states
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [promotionToGoLive, setPromotionToGoLive] = useState<Promotion | null>(null);
  const [isGoingLive, setIsGoingLive] = useState(false);
  
  const [showRemoveLiveModal, setShowRemoveLiveModal] = useState(false);
  const [promotionToRemoveLive, setPromotionToRemoveLive] = useState<Promotion | null>(null);
  const [isRemovingLive, setIsRemovingLive] = useState(false);
  
  const [showDeleteLiveModal, setShowDeleteLiveModal] = useState(false);
  const [promotionToDeleteLive, setPromotionToDeleteLive] = useState<string | null>(null);
  const [isDeletingLive, setIsDeletingLive] = useState(false);
  
  const [showDeleteSavedModal, setShowDeleteSavedModal] = useState(false);
  const [promotionToDeleteSaved, setPromotionToDeleteSaved] = useState<string | null>(null);

  const isWeb = Platform.OS === "web";

  // Fetch all promotions from API
  const fetchAllPromotions = useCallback(async () => {
    try {
      setIsLoadingPromotions(true);
      setErrorLoadingPromotions(null);
      
      const apiPromotions = await promotionService.getAllPromotions();
      
      // Convert API promotions to local Promotion format
      const convertedPromotions: Promotion[] = apiPromotions.map((promo: APIPromotion) => ({
        id: promo._id || Date.now().toString(),
        _id: promo._id,
        title: promo.title,
        url: promo.link || promo.imageURL,
        image: promo.imageURL,
        isLive: promo.isLive || false,
        startingDate: promo.startDate,
        endingDate: promo.endDate,
        attachedProducts: promo.products || [],
      }));
      
      // Separate into live and saved promotions
      const live = convertedPromotions.filter((p) => p.isLive === true);
      const saved = convertedPromotions.filter((p) => p.isLive !== true);
      
      // console.log("Fetched promotions - Total:", convertedPromotions.length, "Live:", live.length, "Saved:", saved.length);
      
      setLivePromotions(live);
      setSavedPromotions(saved);
    } catch (error: any) {
      console.error("Error fetching promotions:", error);
      const errorMessage = error?.response?.data?.message || "Failed to load promotions";
      setErrorLoadingPromotions(errorMessage);
      setLivePromotions([]);
      setSavedPromotions([]);
    } finally {
      setIsLoadingPromotions(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAllPromotions();
  }, [fetchAllPromotions]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchAllPromotions();
    }, [fetchAllPromotions])
  );

  // Build promotion update data
  const buildPromotionUpdateData = (promotion: Promotion, isLive: boolean): PromotionUpdateData => {
    // const hasProducts =
    // promotion.attachedProducts &&
    // promotion.attachedProducts.length > 0;
    // const productIds = (promotion.attachedProducts || [])
    //   .map((p: any) => p._id || p.id)
    //   .filter(Boolean);
      // console.log("Promotion in buildPromotionUpdate",promotion);

    return {
      title: promotion.title,
      link: promotion.url,
      isInternalLink: isInternalLink(promotion.url),
      isLive: isLive,
      startDate: formatDateForAPI(promotion.startingDate || getTodayDate()),
      endDate: formatDateForAPI(promotion.endingDate || getDefaultEndDate()),
     products : promotion.attachedProducts || []
    };
  };

  // Handle Remove Live
  const handleRemoveLiveClick = (id: string) => {
    const promotion = livePromotions.find((p) => p.id === id);
    if (promotion) {
      setPromotionToRemoveLive(promotion);
      setShowRemoveLiveModal(true);
    }
  };

  const confirmRemoveLive = async () => {
    if (!promotionToRemoveLive || !promotionToRemoveLive._id) {
      setShowRemoveLiveModal(false);
      setPromotionToRemoveLive(null);
      return;
    }

    setIsRemovingLive(true);

    try {
      const updateData = buildPromotionUpdateData(promotionToRemoveLive, false);
      
      await promotionService.updatePromotion(promotionToRemoveLive._id, updateData);
      
      // Refresh promotions from server
      await fetchAllPromotions();
      
      showAlert("Success", "Promotion removed from live");
    } catch (error: any) {
      console.error("Error removing promotion from live:", error);
      showAlert("Error", error?.response?.data?.message || "Failed to remove promotion from live");
    } finally {
      setIsRemovingLive(false);
      setShowRemoveLiveModal(false);
      setPromotionToRemoveLive(null);
    }
  };

  // Handle Go Live
  const handleGoLive = (id: string) => {
    const promotion = savedPromotions.find((p) => p.id === id);
    if (!promotion) {
      console.error("Promotion not found in savedPromotions:", id);
      return;
    }

    // Check if today's date is within the promotion's date range
    if (!isDateInRange(promotion.startingDate, promotion.endingDate)) {
      showAlert(
        "Invalid Date Range",
        "Cannot go live. Today's date must be within the promotion's start and end dates. Please edit the promotion to update the dates."
      );
      return;
    }

    // console.log("Go Live - Promotion found:", promotion);
    setPromotionToGoLive(promotion);
    setShowGoLiveModal(true);
  };

  const confirmGoLive = async () => {
    if (!promotionToGoLive || !promotionToGoLive._id) {
      setShowGoLiveModal(false);
      setPromotionToGoLive(null);
      return;
    }

    setIsGoingLive(true);

    try {
      // console.log("Making promotion live:", promotionToGoLive._id);
      
      const updateData = buildPromotionUpdateData(promotionToGoLive, true);
      
      // console.log("Update data:", JSON.stringify(updateData, null, 2));
      
      const updatedPromotion = await promotionService.updatePromotion(
        promotionToGoLive._id,
        updateData
      );
      
      // console.log("Updated promotion response:", updatedPromotion);
      
      // Verify the update
      if (updatedPromotion && !updatedPromotion.isLive) {
        console.warn("Warning: Promotion was updated but isLive is still false!");
      }
      
      // Small delay to ensure backend processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh promotions from server
      await fetchAllPromotions();
      
      showAlert("Success", "Promotion is now live!");
    } catch (error: any) {
      console.error("Error making promotion live:", error);
      showAlert("Error", error?.response?.data?.message || error?.message || "Failed to make promotion live");
    } finally {
      setIsGoingLive(false);
      setShowGoLiveModal(false);
      setPromotionToGoLive(null);
    }
  };

  // Handle Delete Live
  const handleDeleteLive = (id: string) => {
    setPromotionToDeleteLive(id);
    setShowDeleteLiveModal(true);
  };

  const confirmDeleteLive = async () => {
    if (!promotionToDeleteLive) {
      setShowDeleteLiveModal(false);
      return;
    }

    setIsDeletingLive(true);

    try {
      const promotion = livePromotions.find((p) => p.id === promotionToDeleteLive);
      
      if (promotion && promotion._id) {
        await promotionService.deletePromotion(promotion._id);
        
        // Refresh promotions from server
        await fetchAllPromotions();
        
        showAlert("Success", "Promotion deleted successfully");
      }
    } catch (error: any) {
      console.error("Error deleting promotion:", error);
      showAlert("Error", error?.response?.data?.message || "Failed to delete promotion");
    } finally {
      setIsDeletingLive(false);
      setShowDeleteLiveModal(false);
      setPromotionToDeleteLive(null);
    }
  };

  // Handle Delete Saved
  const handleDeleteSaved = (id: string) => {
    setPromotionToDeleteSaved(id);
    setShowDeleteSavedModal(true);
  };

  const confirmDeleteSaved = async () => {
    if (!promotionToDeleteSaved) {
      setShowDeleteSavedModal(false);
      return;
    }

    try {
      const promotion = savedPromotions.find((p) => p.id === promotionToDeleteSaved);
      
      if (promotion && promotion._id) {
        // If promotion exists in backend, delete it
        await promotionService.deletePromotion(promotion._id);
        showAlert("Success", "Promotion deleted successfully");
      } else {
        // If it's only local, just remove from state
        setSavedPromotions(prev => prev.filter((p) => p.id !== promotionToDeleteSaved));
      }
      
      // Refresh promotions from server
      await fetchAllPromotions();
    } catch (error: any) {
      console.error("Error deleting promotion:", error);
      showAlert("Error", error?.response?.data?.message || "Failed to delete promotion");
    } finally {
      setShowDeleteSavedModal(false);
      setPromotionToDeleteSaved(null);
    }
  };

  // Handle Edit
  const handleEditPromotion = (promotion: Promotion) => {
    redirectToPage(containers.EditPromotionScreen, {
      promotion: JSON.stringify(promotion),
    });
  };

  // Check if promotion can go live (date range check)
  const canGoLive = (promotion: Promotion): boolean => {
    return isDateInRange(promotion.startingDate, promotion.endingDate);
  };

  // Layout components
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="Promotional Slides" />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="home" />;

  // Combine promotions for display
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

        {/* Promotions List */}
        {isLoadingPromotions ? (
          <View style={styles.emptyState as ViewStyle}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.emptyStateText as TextStyle}>Loading promotions...</Text>
          </View>
        ) : errorLoadingPromotions ? (
          <View style={styles.emptyState as ViewStyle}>
            <Text style={styles.emptyStateText as TextStyle}>{errorLoadingPromotions}</Text>
            <TouchableOpacity
              style={[styles.addNewButton as ViewStyle, { marginTop: 16 }]}
              onPress={fetchAllPromotions}
            >
              <Text style={styles.addNewButtonText as TextStyle}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : allPromotions.length > 0 ? (
          isWeb ? (
            <View style={styles.gridContainer as ViewStyle}>
              {allPromotions.map((item, index) => (
                <View 
                  key={`${item.id}-${index}`}
                  style={[
                    styles.gridCardWrapper as ViewStyle,
                    (index + 1) % 4 === 0 && { marginRight: 0 } as ViewStyle
                  ]}
                >
                  <View style={styles.cardContainer as ViewStyle}>
                    {item.isLive && (
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
                      canGoLive={canGoLive(item)}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View>
              {allPromotions.map((item, index) => (
                <View key={`${item.id}-${index}`} style={styles.mobileCardWrapper as ViewStyle}>
                  <View style={styles.cardContainer as ViewStyle}>
                    {item.isLive && (
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
                      canGoLive={canGoLive(item)}
                    />
                  </View>
                </View>
              ))}
            </View>
          )
        ) : (
          <View style={styles.emptyState as ViewStyle}>
            <Text style={styles.emptyStateText as TextStyle}>No promotions found</Text>
          </View>
        )}
      </ScrollView>

      {/* Remove Live Confirmation Modal */}
      <ConfirmationModal
        isModalVisible={showRemoveLiveModal}
        onClose={() => {
          if (!isRemovingLive) {
            setShowRemoveLiveModal(false);
            setPromotionToRemoveLive(null);
          }
        }}
        handleCancel={() => {
          if (!isRemovingLive) {
            setShowRemoveLiveModal(false);
            setPromotionToRemoveLive(null);
          }
        }}
        handleSubmit={confirmRemoveLive}
        title="Remove Live Promotion"
        text={
          isRemovingLive
            ? "Removing promotion from live..."
            : "Are you sure you want to remove this promotion from live?"
        }
        submitText={isRemovingLive ? "Removing..." : "Yes"}
        cancelText="No"
        disabled={isRemovingLive}
      />
      
      {/* Go Live Confirmation Modal */}
      <ConfirmationModal
        isModalVisible={showGoLiveModal}
        onClose={() => {
          if (!isGoingLive) {
            setShowGoLiveModal(false);
            setPromotionToGoLive(null);
          }
        }}
        handleCancel={() => {
          if (!isGoingLive) {
            setShowGoLiveModal(false);
            setPromotionToGoLive(null);
          }
        }}
        handleSubmit={confirmGoLive}
        title="Go Live"
        text={
          isGoingLive
            ? "Making promotion live..."
            : "Are you sure you want to make this promotion live?"
        }
        submitText={isGoingLive ? "Going Live..." : "Go Live"}
        cancelText="Cancel"
        disabled={isGoingLive}
      />
      
      {/* Delete Live Confirmation Modal */}
      <ConfirmationModal
        isModalVisible={showDeleteLiveModal}
        onClose={() => {
          if (!isDeletingLive) {
            setShowDeleteLiveModal(false);
            setPromotionToDeleteLive(null);
          }
        }}
        handleCancel={() => {
          if (!isDeletingLive) {
            setShowDeleteLiveModal(false);
            setPromotionToDeleteLive(null);
          }
        }}
        handleSubmit={confirmDeleteLive}
        title="Delete Promotion"
        text={
          isDeletingLive
            ? "Deleting promotion..."
            : "Are you sure you want to delete this live promotion?"
        }
        submitText={isDeletingLive ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        isDestructive={true}
        disabled={isDeletingLive}
      />
      
      {/* Delete Saved Confirmation Modal */}
      <ConfirmationModal
        isModalVisible={showDeleteSavedModal}
        onClose={() => {
          setShowDeleteSavedModal(false);
          setPromotionToDeleteSaved(null);
        }}
        handleCancel={() => {
          setShowDeleteSavedModal(false);
          setPromotionToDeleteSaved(null);
        }}
        handleSubmit={confirmDeleteSaved}
        title="Delete Promotion"
        text="Are you sure you want to delete this promotion?"
        submitText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </LayoutComponent>
  );
};

export default AdminPromotion;