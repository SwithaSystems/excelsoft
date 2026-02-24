import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import Header from "../../../components/Header";
import colors from "../../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { categoryService } from "@/services/categoryService";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { ADMIN_CATEGORIES_SCREEN_TITLE } from "../../../../constants/stringLiterals";
import CategoryDropdown from "../components/categoryDropdown";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";

interface Category {
  _id: any;
  id: number;
  name: string;
  description?: string;
  images?: string[];
  parentCategory?: number;
}

const MAX_IMAGES = 5;

const AdminAddCategoriesWeb = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImages, setCategoryImages] = useState<any[]>([]);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Success Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Cancel confirmation modal state
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  // const { width } = useWindowDimensions();
  // const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;
  const isDesktopWeb = isWeb && !isMobileWeb;

  // Get params if editing
  const params = useLocalSearchParams();

  const openImagePickerAsync = useCallback(
    async (type: "camera" | "gallery") => {
      try {
        if (categoryImages.length >= MAX_IMAGES) {
          if (isWeb) {
            alert(`You can only upload up to ${MAX_IMAGES} images.`);
          } else {
            showAlert(
              "Limit Reached",
              `You can only upload up to ${MAX_IMAGES} images.`
            );
          }
          return;
        }

        let result;

        if (type === "camera") {
          const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPerm.granted) {
            if (isWeb) {
              alert("Permission to access camera is required!");
            } else {
              showAlert(
                "Permission Required",
                "Permission to access camera is required!"
              );
            }
            return;
          }

          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });
        } else {
          const galleryPerm =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!galleryPerm.granted) {
            if (isWeb) {
              alert("Permission to access gallery is required!");
            } else {
              showAlert(
                "Permission Required",
                "Permission to access gallery is required!"
              );
            }
            return;
          }

          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: MAX_IMAGES - categoryImages.length,
            aspect: [4, 3],
            quality: 0.8,
          });
        }

        if (
          !result.canceled &&
          "assets" in result &&
          result.assets?.length > 0
        ) {
          const newImages = result.assets.map((asset) => ({ uri: asset.uri }));

          setCategoryImages((prev: any) => {
            const updatedImages = [...prev, ...newImages];

            if (updatedImages.length > MAX_IMAGES) {
              if (isWeb) {
                alert(`Only the first ${MAX_IMAGES} images have been added.`);
              } else {
                showAlert(
                  "Limit Exceeded",
                  `Only the first ${MAX_IMAGES} images have been added.`
                );
              }
              return updatedImages.slice(0, MAX_IMAGES);
            }
            return updatedImages;
          });
        }
      } catch (error) {
        console.error("Error picking image:", error);
        if (isWeb) {
          alert("Something went wrong while picking the image.");
        } else {
          showAlert("Error", "Something went wrong while picking the image.");
        }
      }
    },
    [categoryImages.length, isWeb]
  );

  const showImageOptions = useCallback(() => {
    // On web, skip the alert and directly open gallery
    if (isWeb) {
      openImagePickerAsync("gallery");
    } else {
      showAlert("Select Image", "Choose image source", [
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
    }
  }, [openImagePickerAsync, isWeb]);

  const removeImage = useCallback((index: any) => {
    if (isWeb) {
      // On web, use window.confirm
      if (window.confirm("Are you sure you want to remove this image?")) {
        setCategoryImages((prev: any) => {
          const updatedImages = [...prev];
          updatedImages.splice(index, 1);
          return updatedImages;
        });
      }
    } else {
      // On mobile, use Alert.alert
      showAlert("Remove Image", "Are you sure you want to remove this image?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            setCategoryImages((prev: any) => {
              const updatedImages = [...prev];
              updatedImages.splice(index, 1);
              return updatedImages;
            });
          },
          style: "destructive",
        },
      ]);
    }
  }, [isWeb]);

  async function getAllCategories() {
    try {
      const categories = await categoryService.getAllCategories();
      if (categories) {
        setCategoryList(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showAlert("Error", "Failed to fetch categories");
    }
  }

  // Clear form function
  const clearForm = useCallback(() => {
    setCategoryName("");
    setCategoryDescription("");
    setCategoryImages([]);
    setParentCategory(null);
    setIsEditMode(false);
    setEditingCategoryId(null);
  }, []);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (isWeb) {
      // On web, show ConfirmationModal
      setShowCancelModal(true);
    } else {
      // On mobile, use Alert.alert
      showAlert(
        "Cancel",
        "Are you sure you want to cancel? All changes will be lost.",
        [
          {
            text: "Continue",
            style: "cancel",
          },
          {
            text: "Cancel",
            onPress: () => router.back(),
            style: "destructive",
          },
        ]
      );
    }
  }, [isWeb]);

  // Handle discard changes (navigate back to categories)
  const handleDiscardChanges = useCallback(() => {
    setShowCancelModal(false);
    // Navigate back to Categories listing page
    redirectToPage(containers.AdminCategoriesScreen);
  }, []);

  // Handle cancel modal (just close the modal)
  const handleCancelModal = useCallback(() => {
    setShowCancelModal(false);
  }, []);

  const handleAddCategory = useCallback(async () => {
    try {
      setLoading(true);
      // console.log(" Parentcategory to update", parentCategory);

      // Validate required fields
      if (!categoryName.trim()) {
        if (isWeb) {
          alert("Category name is required");
        } else {
          showAlert("Error", "Category name is required");
        }
        setLoading(false);
        return;
      }

      // Create FormData for multipart/form-data upload
      const formData = new FormData();

      if (isEditMode && editingCategoryId) {
        // Edit mode - use existing ID
        formData.append("id", editingCategoryId.toString());
      } else {
        // Add mode - find the max id from the category list
        const maxId = categoryList.reduce((max, category) => {
          return category.id &&
            typeof category.id === "number" &&
            category.id > max
            ? category.id
            : max;
        }, 0);

        const newId = maxId + 1;
        formData.append("id", newId.toString());
      }

      // Append regular text fields
      formData.append("name", categoryName.trim());
      if (categoryDescription.trim()) {
        formData.append("description", categoryDescription.trim());
      }

      // Handle parentCategory as number, not string
      if (parentCategory && typeof parentCategory === "number") {
        formData.append("parentCategory", parentCategory.toString());
      }

      // Process images - append each image to form data
      for (let index = 0; index < categoryImages.length; index++) {
        const img = categoryImages[index];
        
        // Only append if there's a URI (valid image)
        if (img.uri) {
          const uri = img.uri || img.path || img;
          const fileName = img.fileName || `category_image_${index}.jpg`;

          // Determine image type (default to jpeg if can't determine)
          const fileType = fileName.includes(".png")
            ? "image/png"
            : fileName.includes(".jpg") || fileName.includes(".jpeg")
            ? "image/jpeg"
            : "image/jpeg";

          // On web, we need to convert the blob URL to a File object
          if (Platform.OS === "web") {
            try {
              const response = await fetch(img.uri);
              const blob = await response.blob();
              const file = new File([blob], fileName, { type: fileType });
              formData.append("image", file);
            } catch (error) {
              console.error("Error converting image to file:", error);
            }
          } else {
            // On mobile, use the standard format
            formData.append("image", {
              uri: img.uri,
              name: fileName,
              type: fileType,
            } as any);
          }
        }
      }

      // console.log(
        // `Submitting form data for category ${
        //   isEditMode ? "update" : "creation"
        // }`,
      //   formData
      // );

      let result;
      if (isEditMode && editingCategoryId) {
        result = await categoryService.updateCategory(
          editingCategoryId,
          formData
        );
      } else {
        result = await categoryService.addCategory(formData);
      }

      // console.log(
      //   `Result for category ${isEditMode ? "update" : "creation"}`,
      //   result
      // );

      if (!result) {
        if (isWeb) {
          alert(`Failed to ${isEditMode ? "update" : "add"} category`);
        } else {
          showAlert(
            "Error",
            `Failed to ${isEditMode ? "update" : "add"} category`
          );
        }
        return;
      } else {
        clearForm();
        
        // Show success modal
        setSuccessMessage(
          `Category ${isEditMode ? "updated" : "added"} successfully`
        );
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} category:`,
        error
      );
      if (isWeb) {
        alert(`Failed to ${isEditMode ? "update" : "add"} category`);
      } else {
        showAlert(
          "Error",
          `Failed to ${isEditMode ? "update" : "add"} category`
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    categoryName,
    categoryDescription,
    categoryImages,
    parentCategory,
    isEditMode,
    editingCategoryId,
    categoryList,
    clearForm,
    isWeb,
  ]);

  useEffect(() => {
    getAllCategories();
  }, []);

  // Handle edit mode from route params
  useEffect(() => {
    if (params.editCategory) {
      try {
        const category = JSON.parse(params.editCategory as string);
        setCategoryName(category.name || "");
        setCategoryDescription(category.description || "");
        setParentCategory(category.parentCategory || null);
        
        // Convert image URLs to the format expected by the image picker
        const imageObjects =
          category.images?.map((imageUrl: string) => ({ uri: imageUrl })) || [];
        setCategoryImages(imageObjects);
        
        setIsEditMode(true);
        setEditingCategoryId(category._id);
      } catch (error) {
        console.error("Error parsing category data:", error);
      }
    }
  }, [params.editCategory]);

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText="Add Category" />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="products" />;

    return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={!isWeb}
      scrollable={true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
             style={[
               styles.formContainer,
               isWeb
                 ? {
                     width: isMobileWeb ? "100%" : "70%",
                     paddingVertical: isMobileWeb ? 0 : 20,
                   }
                 : { paddingHorizontal: 0 },
             ]}
           >
          <View
            style={[
              styles.sectionHeader,
              isMobileWeb && styles.sectionHeaderMobile,
            ]}
          >
            <Text style={[
                styles.sectionTitle,
                isMobileWeb && styles.sectionTitleMobile,  
              ]}>
              {isEditMode ? "Edit Category" : "Add New Category"}
            </Text>
            {isEditMode && (
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <CustomTextInput
            value={categoryName}
            setValue={setCategoryName}
            placeholder="Enter Category name *"
            containerStyle={styles.input}
            onPress={() => {}}
          />

          <CustomTextInput
            value={categoryDescription}
            setValue={setCategoryDescription}
            placeholder="Enter Category description (optional)"
            containerStyle={styles.input}
            onPress={() => {}}
          />

          <CategoryDropdown
            categories={categoryList.filter(
              (cat) => cat.id !== editingCategoryId
            )}
            selectedCategory={parentCategory}
            setSelectedCategory={setParentCategory}
            containerStyle={{ borderColor: colors.primary }}
            placeholder="Select parent category (optional)"
          />

          {/* Image Selection Section */}
          <View style={styles.imageSection}>
            <Text style={styles.imageLabel}>Category Images</Text>

            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={showImageOptions}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.imagePickerText}>Add Image</Text>
            </TouchableOpacity>

            {/* Image Preview */}
            {categoryImages.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagePreviewContainer}
              >
                {categoryImages.map((image, index) => (
                  <React.Fragment key={index}>
                    <View style={styles.imagePreviewItem}>
                      <Image
                        source={{ uri: image.uri }}
                        style={styles.previewImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color={colors.primaryRed}
                        />
                      </TouchableOpacity>
                    </View>
                  </React.Fragment>
                ))}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity
            style={[styles.addButton, loading && styles.disabledButton]}
            onPress={handleAddCategory}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Category"
                : "Add Category"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <ConfirmationModal
        isModalVisible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
        title="Success"
        text={successMessage}
        submitText="OK"
        handleSubmit={() => {
          setShowSuccessModal(false);
          router.back();
        }}
      />

      {/* Cancel Confirmation Modal - Web only */}
      {isWeb && (
        <ConfirmationModal
          isModalVisible={showCancelModal}
          onClose={handleCancelModal}
          title="Discard changes?"
          text="Are you sure you want to cancel? All unsaved changes will be lost."
          submitText="Discard"
          cancelText="Cancel"
          handleSubmit={handleDiscardChanges}
          handleCancel={handleCancelModal}
        />
      )}
      {confirmationModal}
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  mobileWebContainer: {
    width: "95%",
    alignSelf: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeaderMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 35,
    color: colors.black,
  },
  sectionTitleMobile: {
    fontSize: 24,
    color: colors.black,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.placeholdergrey,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    marginBottom: 12,
  },
  imageSection: {
    marginVertical: 16,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 16,
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  imagePreviewContainer: {
    marginTop: 12,
  },
  imagePreviewItem: {
    position: "relative",
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  addButton: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 140,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AdminAddCategoriesWeb;