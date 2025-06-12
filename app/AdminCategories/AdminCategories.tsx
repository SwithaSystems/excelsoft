import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Button } from "react-native-elements";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { categoryService } from "@/services/categoryService";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import AdminFooter from "@/components/AdminFooter";
import PageLayout from "../pageLayoutProps";

interface Category {
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
  const [parentCategory, setParentCategory] = useState("");
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const openImagePickerAsync = useCallback(
    async (type: "camera" | "gallery") => {
      try {
        if (categoryImages.length >= MAX_IMAGES) {
          Alert.alert(
            "Limit Reached",
            `You can only upload up to ${MAX_IMAGES} images.`
          );
          return;
        }

        let result;

        if (type === "camera") {
          const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPerm.granted) {
            Alert.alert(
              "Permission Required",
              "Permission to access camera is required!"
            );
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
            Alert.alert(
              "Permission Required",
              "Permission to access gallery is required!"
            );
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
              Alert.alert(
                "Limit Exceeded",
                `Only the first ${MAX_IMAGES} images have been added.`
              );
              return updatedImages.slice(0, MAX_IMAGES);
            }
            return updatedImages;
          });
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Something went wrong while picking the image.");
      }
    },
    [categoryImages.length]
  );

  const showImageOptions = useCallback(() => {
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
  }, [openImagePickerAsync]);

  const removeImage = useCallback((index: any) => {
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
  }, []);

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

  const handleAddCategory = useCallback(async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!categoryName.trim()) {
        Alert.alert("Error", "Category name is required");
        return;
      }

      // Create FormData for multipart/form-data upload
      const formData = new FormData();

      // Find the max id from the category list
      const maxId = categoryList.reduce((max, category) => {
        return category.id &&
          typeof category.id === "number" &&
          category.id > max
          ? category.id
          : max;
      }, 0);

      const newId = maxId + 1;
      formData.append("id", newId.toString());
      // Append regular text fields
      formData.append("name", categoryName.trim());
      if (categoryDescription.trim()) {
        formData.append("description", categoryDescription.trim());
      }
      if (parentCategory.trim()) {
        formData.append("parentCategory", parentCategory.trim());
      }

      // Process images - append each image to form data
      categoryImages.forEach((img: any, index: any) => {
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

          // Append image to form data
          formData.append("image", {
            uri: img.uri,
            name: fileName,
            type: fileType,
          } as any);
        }
      });

      console.log("Submitting form data for category creation", formData);

      const addedCategory = await categoryService.addCategory(formData);
      if (!addedCategory) {
        Alert.alert("Error", "Failed to add category");
        return;
      } else {
        // Refresh the category list
        await getAllCategories();

        // Clear form
        setCategoryName("");
        setCategoryDescription("");
        setCategoryImages([]);
        setParentCategory("");

        Alert.alert("Success", "Category added successfully");
        router.back();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      Alert.alert("Error", "Failed to add category");
    } finally {
      setLoading(false);
    }
  }, [categoryName, categoryDescription, categoryImages, parentCategory]);

  useEffect(() => {
    getAllCategories();
  }, []);

  console.log("categoryList", categoryList);

  const getParentCategoryName = (parentCategoryId: any, categories: any) => {
    const parentCategory = categories.find(
      (cat: any) => cat.id === parentCategoryId
    );
    return parentCategory ? parentCategory.name : "No Parent";
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    //   <View style={styles.container}>
    //     <Header headerText="Categories" />
    <PageLayout
      hasHeader
      hasFooter
      headerComponent={<Header headerText="Categories" />}
      footerComponent={<AdminFooter activeTab="categories" />}
      scrollable
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Add New Category</Text>

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

          <CustomTextInput
            value={parentCategory}
            setValue={setParentCategory}
            placeholder="Enter parent category ID (optional)"
            containerStyle={styles.input}
            keyboardType="numeric"
            onPress={() => {}}
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
                  <View key={index} style={styles.imagePreviewItem}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.previewImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
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
              {loading ? "Adding..." : "Add Category"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Existing Categories</Text>
          <ScrollView style={styles.listContainer}>
            {categoryList.map((categoryItem: Category, index: number) => (
              <TouchableOpacity
                key={categoryItem.id || index}
                style={styles.categoryItem}
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
                    <Text style={styles.categoryName}>{categoryItem.name}</Text>
                    {categoryItem.description && (
                      <Text style={styles.categoryDescription}>
                        {categoryItem.description}
                      </Text>
                    )}
                    <Text style={styles.categoryId}>
                      ID: {categoryItem.id} Parent:{" "}
                      {getParentCategoryName(
                        categoryItem.parentCategory,
                        categoryList
                      )}
                    </Text>
                    {/* {categoryItem.parentCategory && (
                        <Text style={styles.parentCategory}>
                          Parent: {categoryItem.parentCategory}
                        </Text>
                      )} */}
                  </View>
                </View>
                {/* <Ionicons name="chevron-forward" size={20} color="#C8C8C8" /> */}
              </TouchableOpacity>
            ))}
            {categoryList.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No categories found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
      {/* </View>
      <AdminFooter activeTab="categories" />
    </SafeAreaView> */}
    </PageLayout>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.primary,
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
    marginBottom: 16,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
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
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
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
    // paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
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
    color: "#333",
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  categoryId: {
    fontSize: 12,
    color: "#888",
    marginBottom: 1,
  },
  parentCategory: {
    fontSize: 12,
    color: "#888",
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});

export default AdminCategories;
