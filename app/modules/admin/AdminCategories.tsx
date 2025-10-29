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

interface Category {
  _id: any;
  id: number;
  name: string;
  description?: string;
  images?: string[];
  parentCategory?: number;
}

const MAX_IMAGES = 5;

const AdminCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImages, setCategoryImages] = useState<any[]>([]);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";

  // Get params to detect refresh
  const params = useLocalSearchParams();

  const openImagePickerAsync = useCallback(
    async (type: "camera" | "gallery") => {
      try {
        if (categoryImages.length >= MAX_IMAGES) {
          if (isWeb) {
            alert(`You can only upload up to ${MAX_IMAGES} images.`);
          } else {
            Alert.alert(
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
              Alert.alert(
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
              Alert.alert(
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
          // Add new images to the existing ones, limited to MAX_IMAGES
          const newImages = result.assets.map((asset) => ({ uri: asset.uri }));

          setCategoryImages((prev: any) => {
            const updatedImages = [...prev, ...newImages];

            if (updatedImages.length > MAX_IMAGES) {
              if (isWeb) {
                alert(`Only the first ${MAX_IMAGES} images have been added.`);
              } else {
                Alert.alert(
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
          Alert.alert("Error", "Something went wrong while picking the image.");
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
      Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
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
      Alert.alert("Error", "Failed to fetch categories");
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
      const imageObjects =
        category.images?.map((imageUrl) => ({ uri: imageUrl })) || [];
      setCategoryImages(imageObjects);

      setIsEditMode(true);
      setEditingCategoryId(category._id);
    }
  }, [isTabOrDesktop]);

  const handleDeleteCategory = useCallback((categoryId: number) => {
    if (isWeb) {
      // On web, use window.confirm
      if (window.confirm("Are you sure you want to delete this category?")) {
        const performDelete = async () => {
          try {
            setLoading(true);
            const result = await categoryService.deleteCategory(categoryId);
            if (result) {
              await getAllCategories();
              alert("Category deleted successfully");
            }
          } catch (error: any) {
            console.log("Delete error:", error?.response?.data);

            const errorMessage =
              error?.response?.data?.message ||
              "Something went wrong while deleting the category.";

            alert(errorMessage);
          } finally {
            setLoading(false);
          }
        };
        performDelete();
      }
    } else {
      // On mobile, use Alert.alert
      Alert.alert(
        "Delete Category",
        "Are you sure you want to delete this category?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                const result = await categoryService.deleteCategory(categoryId);
                if (result) {
                  await getAllCategories();
                  Alert.alert("Success", "Category deleted successfully");
                }
              } catch (error: any) {
                console.log("Delete error:", error?.response?.data);

                const errorMessage =
                  error?.response?.data?.message ||
                  "Something went wrong while deleting the category.";

                Alert.alert("Error", errorMessage);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    }
  }, [isWeb]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (isWeb) {
      // On web, use window.confirm
      if (window.confirm("Are you sure you want to cancel editing? All changes will be lost.")) {
        clearForm();
      }
    } else {
      // On mobile, use Alert.alert
      Alert.alert(
        "Cancel Edit",
        "Are you sure you want to cancel editing? All changes will be lost.",
        [
          {
            text: "Continue Editing",
            style: "cancel",
          },
          {
            text: "Cancel Edit",
            onPress: clearForm,
            style: "destructive",
          },
        ]
      );
    }
  }, [clearForm, isWeb]);

  const handleAddCategory = useCallback(async () => {
    try {
      setLoading(true);
      console.log(" Parentcategory to update", parentCategory);

      // Validate required fields
      if (!categoryName.trim()) {
        if (isWeb) {
          alert("Category name is required");
        } else {
          Alert.alert("Error", "Category name is required");
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

      console.log(
        `Submitting form data for category ${
          isEditMode ? "update" : "creation"
        }`,
        formData
      );

      let result;
      if (isEditMode && editingCategoryId) {
        result = await categoryService.updateCategory(
          editingCategoryId,
          formData
        );
      } else {
        result = await categoryService.addCategory(formData);
      }

      console.log(
        `Result for category ${isEditMode ? "update" : "creation"}`,
        result
      );

      if (!result) {
        if (isWeb) {
          alert(`Failed to ${isEditMode ? "update" : "add"} category`);
        } else {
          Alert.alert(
            "Error",
            `Failed to ${isEditMode ? "update" : "add"} category`
          );
        }
        return;
      } else {
        await getAllCategories();

        clearForm();

        if (isWeb) {
          alert(`Category ${isEditMode ? "updated" : "added"} successfully`);
        } else {
          Alert.alert(
            "Success",
            `Category ${isEditMode ? "updated" : "added"} successfully`
          );
        }

        // if (!isEditMode) {
        //   router.back();
        // }
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} category:`,
        error
      );
      if (isWeb) {
        alert(`Failed to ${isEditMode ? "update" : "add"} category`);
      } else {
        Alert.alert(
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

  const getParentCategoryName = (parentCategoryId: any, categories: any) => {
    const parentCategory = categories.find(
      (cat: any) => cat.id === parentCategoryId
    );
    return parentCategory ? parentCategory.name : "No Parent";
  };

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={ADMIN_CATEGORIES_SCREEN_TITLE} />
  );

  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <AdminFooter activeTab="products" />;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isTabOrDesktop}
      scrollable={isTabOrDesktop ? false : true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

       
        {!isTabOrDesktop && (
          <View style={styles.formContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
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
        )}

        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            
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
            <View>
              {categoryList.map((categoryItem: Category, index: number) => (
                <TouchableOpacity
                  key={categoryItem.id || index}
                  style={[
                    styles.categoryItem,
                    editingCategoryId === categoryItem.id &&
                      styles.editingCategoryItem,
                  ]}
                  onPress={() => handleEditCategory(categoryItem)}
                >
                  <View style={styles.categoryContent}>
                    {categoryItem.images && categoryItem.images.length > 0 && (
                      <Image
                        source={{ uri: categoryItem.images[0] }}
                        style={styles.categoryImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>
                        {categoryItem.name}
                      </Text>
                      {categoryItem.description && (
                        <Text style={styles.categoryDescription}>
                          {categoryItem.description}
                        </Text>
                      )}
                      <Text style={styles.categoryId}>
                        ID: {categoryItem.id} | Parent:{" "}
                        {getParentCategoryName(
                          categoryItem.parentCategory,
                          categoryList
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryActions}>
                    {editingCategoryId === categoryItem.id && (
                      <Text style={styles.editingLabel}>Editing</Text>
                    )}
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(categoryItem._id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.primaryRed}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {categoryList.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No categories found</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  formContainer: {
    marginBottom: 24,
    // paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 35, 
    color: colors.black,
    paddingTop:5,
    
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
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

    height:40 ,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.secondary,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
  },
  editingCategoryItem: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.secondary,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 2,
  },
  categoryId: {
    fontSize: 12,
    color: colors.darkGray,
    marginBottom: 1,
  },
  categoryActions: {
    alignItems: "center",
  },
  editingLabel: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.lightgrey,
  },
});

export default AdminCategories;
