import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import Header from "../../components/Header";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { categoryService } from "@/services/categoryService";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { ADMIN_CATEGORIES_SCREEN_TITLE } from "../../../constants/stringLiterals";
import CategoryDropdown from "./components/categoryDropdown";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import SearchBar from "@/app/components/searchBar";
import Pagination from "./componentsWeb/PaginationWeb";

interface Category {
  _id: any;
  id: number;
  name: string;
  description?: string;
  images?: string[];
  parentCategory?: number;
}

const MAX_IMAGES = 5;
const ITEMS_PER_PAGE = 10;

const AdminCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImages, setCategoryImages] = useState<any[]>([]);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [showCancelEditModal, setShowCancelEditModal] = useState(false);
  const [showImageLimitModal, setShowImageLimitModal] = useState(false);
  const [showRemoveImageModal, setShowRemoveImageModal] = useState(false);
  const [imageIndexToRemove, setImageIndexToRemove] = useState<number | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState("");

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";

  // Get params to detect refresh
  const params = useLocalSearchParams();

  const openImagePickerAsync = useCallback(
    async (type: "camera" | "gallery") => {
      try {
        if (categoryImages.length >= MAX_IMAGES) {
          setErrorMessage(`You can only upload up to ${MAX_IMAGES} images.`);
          setShowErrorModal(true);
          return;
        }

        let result;

        if (type === "camera") {
          const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPerm.granted) {
            setPermissionMessage("Permission to access camera is required!");
            setShowPermissionModal(true);
            return;
          }

          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });
        } else {
          const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!galleryPerm.granted) {
            setPermissionMessage("Permission to access gallery is required!");
            setShowPermissionModal(true);
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

        if (!result.canceled && "assets" in result && result.assets?.length > 0) {
          const newImages = result.assets.map((asset) => ({ uri: asset.uri }));

          setCategoryImages((prev: any) => {
            const updatedImages = [...prev, ...newImages];

            if (updatedImages.length > MAX_IMAGES) {
              setErrorMessage(`Only the first ${MAX_IMAGES} images have been added.`);
              setShowErrorModal(true);
              return updatedImages.slice(0, MAX_IMAGES);
            }
            return updatedImages;
          });
        }
      } catch (error) {
        console.error("Error picking image:", error);
        setErrorMessage("Something went wrong while picking the image.");
        setShowErrorModal(true);
      }
    },
    [categoryImages.length]
  );

  const showImageOptions = useCallback(() => {
    // On web, skip the alert and directly open gallery
    if (isWeb) {
      openImagePickerAsync("gallery");
    } else {
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
    }
  }, [openImagePickerAsync, isWeb]);

  const removeImage = useCallback((index: any) => {
    setImageIndexToRemove(index);
    setShowRemoveImageModal(true);
  }, []);

  const confirmRemoveImage = useCallback(() => {
    if (imageIndexToRemove !== null) {
      setCategoryImages((prev: any) => {
        const updatedImages = [...prev];
        updatedImages.splice(imageIndexToRemove, 1);
        return updatedImages;
      });
      setImageIndexToRemove(null);
    }
    setShowRemoveImageModal(false);
  }, [imageIndexToRemove]);

  async function getAllCategories() {
    try {
      const categories = await categoryService.getAllCategories();
      if (categories) {
        setCategoryList(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrorMessage("Failed to fetch categories");
      setShowErrorModal(true);
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

  // Handle edit category click
  const handleEditCategory = useCallback((category: Category) => {
    console.log("Editing category:", category);
    
    // On desktop/tablet, redirect to AdminAddCategoriesWeb page
    if (isTabOrDesktop) {
      redirectToPage(containers.AdminAddCategoriesWebScreen, {
        editCategory: JSON.stringify(category),
      });
    } else {
      // On mobile, edit inline
      setCategoryName(category.name);
      setCategoryDescription(category.description || "");
      setParentCategory(category.parentCategory || null);

      // Convert image URLs to the format expected by the image picker
      const imageObjects = category.images?.map((imageUrl) => ({ uri: imageUrl })) || [];
      setCategoryImages(imageObjects);

      setIsEditMode(true);
      setEditingCategoryId(category._id);
    }
  }, [isTabOrDesktop]);

  const handleDeleteCategory = useCallback((categoryId: any) => {
    setCategoryToDelete(categoryId);
    setShowDeleteConfirmModal(true);
  }, []);

  const confirmDeleteCategory = useCallback(async () => {
    if (categoryToDelete === null) return;

    try {
      setLoading(true);
      const result = await categoryService.deleteCategory(categoryToDelete);
      if (result) {
        await getAllCategories();
        setSuccessMessage("Category deleted successfully");
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.log("Delete error:", error?.response?.data);

      const errorMsg = error?.response?.data?.message || "Something went wrong while deleting the category.";
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
      setShowDeleteConfirmModal(false);
      setCategoryToDelete(null);
    }
  }, [categoryToDelete]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setShowCancelEditModal(true);
  }, []);

  const confirmCancelEdit = useCallback(() => {
    clearForm();
    setShowCancelEditModal(false);
  }, [clearForm]);

  const handleAddCategory = useCallback(async () => {
    try {
      setLoading(true);
      console.log(" Parentcategory to update", parentCategory);

      // Validate required fields
      if (!categoryName.trim()) {
        setErrorMessage("Category name is required");
        setShowErrorModal(true);
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
          return category.id && typeof category.id === "number" && category.id > max ? category.id : max;
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

      console.log(`Submitting form data for category ${isEditMode ? "update" : "creation"}`, formData);

      let result;
      if (isEditMode && editingCategoryId) {
        result = await categoryService.updateCategory(editingCategoryId, formData);
      } else {
        result = await categoryService.addCategory(formData);
      }

      console.log(`Result for category ${isEditMode ? "update" : "creation"}`, result);

      if (!result) {
        setErrorMessage(`Failed to ${isEditMode ? "update" : "add"} category`);
        setShowErrorModal(true);
        return;
      } else {
        await getAllCategories();
        clearForm();
        setSuccessMessage(`Category ${isEditMode ? "updated" : "added"} successfully`);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} category:`, error);
      setErrorMessage(`Failed to ${isEditMode ? "update" : "add"} category`);
      setShowErrorModal(true);
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
  ]);

  useEffect(() => {
    getAllCategories();
  }, []);

  // Refresh when returning from edit page
  useEffect(() => {
    if (params.refresh) {
      getAllCategories();
    }
  }, [params.refresh]);

  // Refresh when screen comes back into focus (after navigating back from add/edit page)
  useFocusEffect(
    useCallback(() => {
      getAllCategories();
    }, [])
  );

  console.log("categoryList", categoryList);

  const handleCategorySearch = useCallback(() => {
    // Filtering is done client-side as user types; nothing to do on submit
  }, [searchQuery]);

  const filteredCategories = (searchQuery || "").trim().length
    ? categoryList.filter((cat: any) => {
        const q = searchQuery.toLowerCase();
        return (
          (cat.name || "").toLowerCase().includes(q) ||
          String(cat.id || "").toLowerCase().includes(q)
        );
      })
    : categoryList;

  // Pagination for web/tablet
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  
  // Get paginated categories for web/tablet, show all for mobile
  const paginatedCategories = isTabOrDesktop
    ? filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : filteredCategories;

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getParentCategoryName = (parentCategoryId: any, categories: any) => {
    const parentCategory = categories.find((cat: any) => cat.id === parentCategoryId);
    return parentCategory ? parentCategory.name : "No Parent";
  };

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={ADMIN_CATEGORIES_SCREEN_TITLE} />
  );

  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <AdminFooter activeTab="categories" />;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isTabOrDesktop}
      scrollable={isTabOrDesktop ? false : true}
      hideNavItems={true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {!isTabOrDesktop && (
          <View style={styles.formContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: isTabOrDesktop ? 35 : 20 }]}>
                {isEditMode ? "Edit Category" : "Add New Category"}
              </Text>
              {isEditMode && (
                <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
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
              categories={categoryList.filter((cat) => cat.id !== editingCategoryId)}
              selectedCategory={parentCategory}
              setSelectedCategory={setParentCategory}
              containerStyle={{ borderColor: colors.primary }}
              placeholder="Select parent category (optional)"
            />

            {/* Image Selection Section */}
            <View style={styles.imageSection}>
              <Text style={styles.imageLabel}>Category Images</Text>

              <TouchableOpacity style={styles.imagePickerButton} onPress={showImageOptions}>
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
                        <Image source={{ uri: image.uri }} style={styles.previewImage} />
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="close-circle" size={24} color={colors.primaryRed} />
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
        )}

        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: isTabOrDesktop ? 35 : 20 }]}>Categories</Text>
            
            {/* Desktop/Tablet: Show button to redirect to add category page */}
            {isTabOrDesktop && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  redirectToPage(containers.AdminAddCategoriesWebScreen);
                }}
              >
                <Text style={styles.addButtonText}>+ Add New Category</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={styles.listContainer}>
            {isTabOrDesktop && (
              <View style={{ marginBottom: 12 }}>
                <SearchBar
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleCategorySearch}
                  onPress={handleCategorySearch}
                  widthPercent={35}
                  height={40}
                />
              </View>
            )}
            <View>
              {paginatedCategories.map((categoryItem: Category, index: number) => (
                <View
                  key={categoryItem.id || index}
                  style={[
                    styles.categoryItem,
                    editingCategoryId === categoryItem.id && styles.editingCategoryItem,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.categoryContent}
                    onPress={() => handleEditCategory(categoryItem)}
                    activeOpacity={0.7}
                  >
                    {categoryItem.images && categoryItem.images.length > 0 && (
                      <Image
                        source={{ uri: categoryItem.images[0] }}
                        style={styles.categoryImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{categoryItem.name}</Text>
                      {categoryItem.description && (
                        <Text style={styles.categoryDescription}>{categoryItem.description}</Text>
                      )}
                      <Text style={styles.categoryId}>
                        ID: {categoryItem.id} | Parent:{" "}
                        {getParentCategoryName(categoryItem.parentCategory, categoryList)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.categoryActions}>
                    {editingCategoryId === categoryItem.id && (
                      <Text style={styles.editingLabel}>Editing</Text>
                    )}
                    <TouchableOpacity onPress={() => handleEditCategory(categoryItem)}>
                      <Ionicons name="create-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteCategory(categoryItem._id)}>
                      <Ionicons name="trash-outline" size={20} color={colors.primaryRed} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {categoryList.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No categories found</Text>
                </View>
              )}
            </View>
          </ScrollView>
          
          {/* Pagination for web/tablet only */}
          {isTabOrDesktop && totalPages > 1 && (
            <View style={styles.stickyBottomContainer}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <ConfirmationModal
        isModalVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        text={successMessage}
        submitText="OK"
        handleSubmit={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <ConfirmationModal
        isModalVisible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        text={errorMessage}
        submitText="OK"
        handleSubmit={() => setShowErrorModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isModalVisible={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="Delete Category"
        text="Are you sure you want to delete this category?"
        submitText="Delete"
        cancelText="Cancel"
        handleSubmit={confirmDeleteCategory}
        handleCancel={() => {
          setShowDeleteConfirmModal(false);
          setCategoryToDelete(null);
        }}
      />

      {/* Cancel Edit Modal */}
      <ConfirmationModal
        isModalVisible={showCancelEditModal}
        onClose={() => setShowCancelEditModal(false)}
        title="Cancel Edit"
        text="Are you sure you want to cancel editing? All changes will be lost."
        submitText="Cancel Edit"
        cancelText="Continue Editing"
        handleSubmit={confirmCancelEdit}
        handleCancel={() => setShowCancelEditModal(false)}
      />

      {/* Remove Image Modal */}
      <ConfirmationModal
        isModalVisible={showRemoveImageModal}
        onClose={() => setShowRemoveImageModal(false)}
        title="Remove Image"
        text="Are you sure you want to remove this image?"
        submitText="Remove"
        cancelText="Cancel"
        handleSubmit={confirmRemoveImage}
        handleCancel={() => {
          setShowRemoveImageModal(false);
          setImageIndexToRemove(null);
        }}
      />

      {/* Permission Modal */}
      <ConfirmationModal
        isModalVisible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title="Permission Required"
        text={permissionMessage}
        submitText="OK"
        handleSubmit={() => setShowPermissionModal(false)}
      />
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    // fontSize is set dynamically in the component
    color: colors.black,
    paddingTop: 5,
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
  listSection: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 2,
  },
  categoryItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    minHeight: 120,
  },
  editingCategoryItem: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  categoryInfo: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 4,
  },
  categoryId: {
    fontSize: 12,
    color: colors.darkGray,
    marginBottom: 1,
  },
  categoryActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    position: "absolute",
    top: 12,
    right: 20,
  },
  editingLabel: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "600",
    marginRight: 8,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.lightgrey,
  },
  paginationContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.placeholdergrey,
    backgroundColor: colors.white,
  },
  stickyBottomContainer: {
    position: Platform.OS === "web" ? "sticky" : "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    paddingVertical: 0,
    marginBottom: 0,
    borderTopWidth: 0,
    borderColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default AdminCategories;