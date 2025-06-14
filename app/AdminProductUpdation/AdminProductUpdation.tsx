import {
  ADMIN_PRODUCT_ADD_SCREEN_TITLE,
  ADMIN_PRODUCT_UPDATE_SCREEN_TITLE,
} from "./../config/stringLiterals";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState, useCallback } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { utilitiesStyles } from "@/assets/styles/utilitiesStyles";
import colors from "../config/colors";
import { router, useLocalSearchParams } from "expo-router";
import { categoryService } from "@/services/categoryService";
import { CheckBox } from "react-native-elements";
import ModalSelector from "react-native-modal-selector";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { ProductsAPI } from "@/services/productService";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";

const AdminProductUpdation = () => {
  const props = useLocalSearchParams();
  const newProduct = props.newProduct;
  const maxId = props.maxId;
  const [productName, setProductName] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [minimumOrderQunatity, setMinimumOrderQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default date as ISO for web support
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerPrice, setOfferPrice] = useState([
    {
      qty: "",
      actualPrice: "",
      discountPrice: "",
    },
  ]);

  const [allCategories, setAllCategories] = useState<any>([]);
  const [productImages, setProductImages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const MAX_IMAGES = 5;

  // Parse product data only once when component mounts
  const productData = React.useMemo(() => {
    return typeof props.item === "string" ? JSON.parse(props.item) : props.item;
  }, [props.item]);

  console.log("Product data in product updation", productData);
  async function getallCategories() {
    try {
      const categories = await categoryService.getAllCategories(2);
      if (categories) {
        setAllCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  useEffect(() => {
    getallCategories();
  }, []);

  useEffect(() => {
    // Only run once when component mounts
    if (productData) {
      setId(productData.id || "");
      setTitle(productData.title || "");
      setProductDescription(productData.description || "");
      setProductName(productData.name || "");
      setStock(productData.stock?.toString() || "");
      setPrice(productData.originalPrice?.toString() || "");
      setDiscountPrice(productData.price?.toString() || "");
      setCategory(productData.categoryId?.[0]?.toString() || "");

      // Set product images if available
      if (productData.image && Array.isArray(productData.image)) {
        setProductImages(productData.image.map((img: any) => ({ uri: img })));
      }

      const now = new Date();
      let hrs = now.getHours();
      const mins = now.getMinutes();
      setPeriod(hrs >= 12 ? "pm" : "am");
      hrs = hrs % 12 || 12;
      setHours(hrs < 10 ? `0${hrs}` : `${hrs}`);
      setMinutes(mins < 10 ? `0${mins}` : `${mins}`);
    }
  }, [productData]);

  // const onDateChange = (
  //   event: DateTimePickerEvent,
  //   selectedDate: Date | undefined
  // ) => {
  //   const currentDate = selectedDate || new Date(date);
  //   setShowDatePicker(false);
  //   setDate(currentDate.toISOString().split("T")[0]); // Format date as yyyy-mm-dd
  // };
  // const addNewPrice = () => {
  //   const newRow = { qty: "", actualPrice: "", discountPrice: "" };
  //   const updatedPrices = offerPrice.concat(newRow);
  //   setOfferPrice(updatedPrices);
  // };
  const openImagePickerAsync = useCallback(
    async (type: "camera" | "gallery") => {
      try {
        if (productImages.length >= MAX_IMAGES) {
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
            selectionLimit: MAX_IMAGES - productImages.length,
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

          setProductImages((prev: any) => {
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
    [productImages.length]
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

  const removeImage = useCallback((index: number) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setProductImages((prev: any[]) => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
          });
        },
      },
    ]);
  }, []);

  console.log("Images in product page", productImages);

  const handleUpdateProduct = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!productName.trim()) {
        Alert.alert("Error", "Product name is required");
        return;
      }

      if (!stock || isNaN(parseInt(stock))) {
        Alert.alert("Error", "Valid stock quantity is required");
        return;
      }

      if (!price || isNaN(parseFloat(price))) {
        Alert.alert("Error", "Valid price is required");
        return;
      }

      if (!category) {
        Alert.alert("Error", "Please select a category");
        return;
      }

      const formData = new FormData();

      // Append regular text fields
      formData.append("name", productName);
      formData.append("id", id ? id : maxId.toString());
      formData.append("title", title);
      formData.append("description", productDescription);
      formData.append("stock", stock);
      formData.append("originalPrice", price);
      formData.append("price", discountPrice || price);
      formData.append("categoryId", category);
      formData.append("minimumOrderQuantity", minimumOrderQunatity || "0");
      formData.append("productColors", JSON.stringify([{ color }]));
      formData.append("isReturnable", isChecked ? "true" : "false");

      // ✅ Separate existing image URLs and new local image files
      const existingImageUrls = productImages
        .filter((img: any) => !img.uri.startsWith("file://"))
        .map((img: any) => img.uri);

      const newImageFiles = productImages.filter((img: any) =>
        img.uri.startsWith("file://")
      );

      // ✅ Send existing Cloudinary URLs to the server
      formData.append("images", JSON.stringify(existingImageUrls));

      // ✅ Send new image files (to upload)
      newImageFiles.forEach((img: any, index: number) => {
        const uri = img.uri;
        const fileName = img.fileName || `image_${Date.now()}_${index}.jpg`;
        const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

        formData.append("imageFiles", {
          uri,
          name: fileName,
          type: fileType,
        } as any);
      });

      console.log("Submitting form data for product update");

      const response = newProduct
        ? await ProductsAPI.addProduct(formData)
        : await ProductsAPI.updateProduct(productData._id, formData);

      if (!response) {
        throw new Error("Failed to update product.");
      }

      Alert.alert(
        "Success",
        newProduct
          ? "Product added successfully!"
          : "Product updated successfully!",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace(
                "/AdminProductDashboard/AdminProductDashboard?refresh=true"
              ),
          },
        ]
      );
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Error", "Failed to update product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    productName,
    stock,
    price,
    discountPrice,
    category,
    color,
    productImages,
    id,
    title,
    productDescription,
    minimumOrderQunatity,
    isChecked,
    router,
    newProduct,
    productData?._id,
  ]);

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    //   <KeyBoardWrapper>
    //     <View style={[globalStyles.container, { paddingTop: 16 }]}>
    //       {newProduct ? (
    //         <Header headerText="Add Product" />
    //       ) : (
    //         <Header headerText={ADMIN_PRODUCT_UPDATE_SCREEN_TITLE} />
    //       )}
    <PageLayout
      hasFooter={false}
      hasHeader
      headerComponent={
        <Header
          headerText={
            newProduct
              ? ADMIN_PRODUCT_ADD_SCREEN_TITLE
              : ADMIN_PRODUCT_UPDATE_SCREEN_TITLE
          }
        />
      }
      scrollable
    >
      <KeyBoardWrapper>
        <ScrollView>
          <View
            style={[
              globalStyles.sectionContent,
              globalStyles.pt_0,
              globalStyles.mt_n3,
            ]}
          >
            <Text style={styles.label}>Product Name</Text>
            <CustomTextInput
              setValue={setProductName}
              value={productName}
              onPress={() => {}}
              placeholder="Enter product name"
            />
            <Text style={styles.label}>Title</Text>
            <CustomTextInput
              value={title}
              setValue={setTitle}
              onPress={() => {}}
              placeholder="Enter title"
              // style={styles.textboxStyles}
            />
            <Text style={styles.label}>Product Description</Text>
            <TextInput
              value={productDescription}
              onChangeText={setProductDescription}
              onPress={() => {}}
              placeholder="Enter Product Description"
              multiline
              numberOfLines={6}
              style={styles.multilinetextbox}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                <ModalSelector
                  data={allCategories.map((cat: any) => ({
                    key: cat.id,
                    label: cat.name,
                    value: cat.id,
                  }))}
                  initValue="Category"
                  onChange={(option) => setCategory(option.value)}
                  optionTextStyle={{ color: colors.primary }}
                  optionContainerStyle={{ backgroundColor: colors.white }}
                  cancelStyle={{ backgroundColor: colors.white }}
                  accessible={true}
                  accessibilityLabel="Select Category"
                >
                  <View style={styles.categorySelector}>
                    <Text
                      style={[
                        styles.categoryText,
                        { color: category ? colors.black : colors.slateGrey },
                      ]}
                    >
                      {category
                        ? allCategories.find((c: any) => c.id == category)?.name
                        : "Select category"}
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                </ModalSelector>
              </View>
            </View>
            <Text style={styles.label}>Stock</Text>
            <CustomTextInput
              setValue={setStock}
              value={stock}
              onPress={() => {}}
              placeholder="Enter available stock"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Price</Text>
            <CustomTextInput
              setValue={setPrice}
              value={price}
              onPress={() => {}}
              placeholder="Enter price per unit"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Discount Price</Text>
            <CustomTextInput
              setValue={setDiscountPrice}
              value={discountPrice}
              onPress={() => {}}
              placeholder="Enter the Discount Price"
              keyboardType="numeric"
            />

            {/* <Text style={styles.label}>Discount Price</Text>
            <CustomTextInput
              setValue={setDiscountPrice}
              value={discountPrice}
              onPress={() => {}}
              placeholder="Enter the discount price"
              keyboardType="numeric"
            /> */}
            <Text style={styles.label}>Minimum Order Qunatity:</Text>
            <CustomTextInput
              setValue={setMinimumOrderQuantity}
              value={minimumOrderQunatity}
              onPress={() => {}}
              placeholder="Enter the minimum order quantity"
              keyboardType="numeric"
            />
            <Text style={[styles.label, { paddingBottom: 8 }]}>Add Color</Text>
            <View
              style={[
                styles.categoryStyles,
                {
                  height: 40,
                  justifyContent: "center",
                  // borderColor: colors.primary,
                  // borderWidth: 1,
                  borderRadius: 8,
                },
              ]}
            >
              <CustomTextInput
                setValue={setColor}
                value={color}
                onPress={() => {}}
                placeholder="Add color"
                keyboardType="numeric"
              />
            </View>
            <View style={[globalStyles.mt_3]}>
              <Text style={[globalStyles.size_16, globalStyles.mb_3]}>
                Pick the date and time when the discount starts and ends.
              </Text>
              <View
                style={[
                  globalStyles.flexRow,
                  globalStyles.justifyContentBetween,
                ]}
              >
                {/* <View style={utilitiesStyles.flex_1}>
                  <Text style={[styles.label, globalStyles.mt_0]}>Date: *</Text>
                  {Platform.OS === "web" ? (
                    <input
                      type="date"
                      style={globalStyles.webDateInput}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  ) : (
                    <TouchableOpacity
                      style={globalStyles.dateInput}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text>{date}</Text>
                    </TouchableOpacity>
                  )}
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(date)}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </View>

                <View style={[utilitiesStyles.flex_1, globalStyles.pl_3]}>
                  <Text style={[styles.label, globalStyles.mt_0]}>Time: *</Text>
                  <View style={globalStyles.timeContainer}>
                    <TextInput
                      style={globalStyles.timeInput}
                      placeholder="HH"
                      keyboardType="numeric"
                      maxLength={2}
                      value={hours}
                      onChangeText={setHours}
                    />
                    <Text>:</Text>
                    <TextInput
                      style={globalStyles.timeInput}
                      placeholder="MM"
                      keyboardType="numeric"
                      maxLength={2}
                      value={minutes}
                      onChangeText={setMinutes}
                    />

                    <Picker
                      selectedValue={period}
                      style={globalStyles.picker_sm}
                      onValueChange={(itemValue) => setPeriod(itemValue)}
                    >
                      <Picker.Item label="AM" value="am" />
                      <Picker.Item label="PM" value="pm" />
                    </Picker>
                  </View>
                </View> */}
              </View>
            </View>
            <View style={styles.checkBox}>
              <CheckBox
                checked={isChecked}
                onPress={() => setIsChecked(!isChecked)}
              />
              <Text>Is returnable?</Text>
            </View>
            {/* <Text style={styles.tableHeading}>
              QTY Actual Price Discounted Price
            </Text>
            {offerPrice.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <TextInput
                  style={styles.tableInput}
                  value={item.qty}
                  //onChangeText={}
                  placeholder="QTY"
                />
                <TextInput
                  style={styles.tableInput}
                  value={item.actualPrice}
                  //onChangeText={}
                  placeholder="Price"
                />
                <TextInput
                  style={styles.tableInput}
                  value={item.discountPrice}
                  //onChangeText={}
                  placeholder="Discounted"
                />

                {index === offerPrice.length - 1 && (
                  <TouchableOpacity onPress={addNewPrice}>
                    <Ionicons name="add" size={24} color="green" />
                  </TouchableOpacity>
                )}
              </View>
            ))} */}
            <Text style={[styles.label, globalStyles.mt_4]}>
              Product Images
            </Text>
            <Text style={styles.subLabel}>
              Upload up to {MAX_IMAGES} images
            </Text>

            <View style={styles.imageContainer}>
              {/* Display existing images */}
              {productImages.map((img: any, index: any) => (
                <View key={`img-${index}`} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: img.uri }}
                    style={styles.productImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add image placeholders */}
              {Array.from({
                length: MAX_IMAGES - productImages.length,
              }).map((_, index) => (
                <TouchableOpacity
                  key={`placeholder-${index}`}
                  style={styles.imagePlaceholder}
                  onPress={showImageOptions}
                >
                  <Text style={styles.plus}>+</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            globalStyles.p_3,
            globalStyles.flexRow,
            globalStyles.justifyContentBetween,
          ]}
        >
          <Button
            onPress={handleUpdateProduct}
            title={newProduct ? "Add" : "Update"}
            disabled={isLoading}
          />
          <Button
            onPress={() => router.back()}
            title="Discard"
            primary={false}
            disabled={isLoading}
          />
        </View>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.offWhite,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 15,
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
    width: 65,
    height: 65,
    borderRadius: 5,
    overflow: "visible",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    height: 60,
    width: "100%",
  },

  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 12,
  },

  categoryText: {
    flex: 1,
    fontSize: 16,
  },

  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  imagePlaceholder: {
    width: 65,
    height: 65,
    backgroundColor: colors.Gray88,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderStyle: "dashed",
  },
  plus: {
    fontSize: 24,
    color: colors.darkGray,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  discardButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.black,
  },
  inputContainer: {
    // marginBottom: 20,
  },
  textboxStyles: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.primary,
    padding: 10,
    textAlignVertical: "top",
  },
  multilinetextbox: {
    height: 150,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.primary,
    padding: 10,
    textAlignVertical: "top",
  },
  categoryStyles: {
    backgroundColor: colors.white,
    borderWidth: 0,
    borderRadius: 8,
    // padding: 10,
    // textAlignVertical: 'top',
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  addImageButton: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  tableHeading: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    //padding: 8,
    alignItems: "center",
    gap: 16,
  },
  tableInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 4,
    padding: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1000,
  },
});

export default AdminProductUpdation;
