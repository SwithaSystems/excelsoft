import {
  ADMIN_PRODUCT_ADD_SCREEN_TITLE,
  ADMIN_PRODUCT_UPDATE_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import colors from "../../../constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { categoryService } from "@/services/categoryService";
import { CheckBox } from "react-native-elements";
import ModalSelector from "react-native-modal-selector";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { ProductsAPI } from "@/services/productService";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { showErrorAlert } from "../../../utilities/showErrorAlert";
import { FIX_VALIDATION_ERRORS } from "../../../constants/customErrorMessages";
import {
  isValidProductName,
  // isValidProductTitle,
  isValidProductDescription,
  // isValidStock,
  isValidPrice,
  // isValidDiscountPrice,
  // isValidMinimumOrderQuantity,
  // isValidProductImages,
  isValidCategory,
} from "../../../utilities/validations";
import CurrencySymbol from "@/constants/CurrencySymbol";
import { clearNavigationStack, redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const AdminProductUpdation = () => {
  const props = useLocalSearchParams();
  const newProduct = props.newProduct;
  const maxId = props.maxId;
  const [productName, setProductName] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [stock, setStock] = useState("");
  const [netPrice, setNetPrice] = useState<any>();
  const [discount, setDiscountPrice] = useState("");
  const [minimumOrderQunatity, setMinimumOrderQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default date as ISO for web support
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isAgeRestricted, setIsAgeRestricted] = useState(false);
  const [isVatApplicable, setIsVatApplicable] = useState(false);
  const [grossPrice, setGrossPrice] = useState<any>("");
  const [vatRate, setVatRate] = useState("");
  const [vatAmount, setVatAmount] = useState("");
  const [netPriceIncVAT, setNetPriceIncVAT] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerPrice, setOfferPrice] = useState([
    {
      qty: "",
      actualPrice: "",
      discount: "",
    },
  ]);

  const [allCategories, setAllCategories] = useState<any>([]);
  const [productImages, setProductImages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const MAX_IMAGES = 5;
  const [isColorsAvailable, setIsColorsAvailable] = useState(false);
  const [selectedColors, setSelectedColors] = useState<any>([]);
  const [showColorModal, setShowColorModal] = useState(false);

  const [errors, setErrors] = useState<
    Partial<{
      productName: string;
      // title: string;
      // productDescription: string;
      // stock: string;
      netPrice: string;
      discount: string;
      category: string;
      // minimumOrderQunatity: string;
      // productImages: string;
      vatRate: string;
      vatAmount: string;
    }>
  >({});

  const productData = React.useMemo(() => {
    return typeof props.item === "string" ? JSON.parse(props.item) : props.item;
  }, [props.item]);

  console.log("Product data in product updation", productData);
  async function getallCategories() {
    try {
      const categories = await categoryService.getAllCategories();
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
    if (productData) {
      setId(productData.id || "");
      setTitle(productData.title || "Product");
      setProductDescription(productData.description || "");
      setProductName(productData.name || "");
      setStock(productData.stock?.toString() || "");
      setNetPrice(productData.netPrice?.toString() || "");
      setDiscountPrice(productData.discount?.toString() || "");
      setCategory(productData.categoryId?.[0]?.toString() || "");
      // setColor(productData.productColors?.[0] || "");
      setMinimumOrderQuantity(
        productData.minimumOrderQuantity?.toString() || ""
      );
      setIsAgeRestricted(productData.isAgeRestricted || false);
      setIsChecked(productData.isReturnable || false);
      setIsVatApplicable(productData.isVatApplicable || false);
      setVatRate(
        productData.vatRate?.toString() ||
          (productData.isVatApplicable ? "20.00" : " ")
      );
      setGrossPrice(productData.grossPrice?.toString() || "");
      setVatAmount(productData.vatAmount?.toString() || "");
      setNetPriceIncVAT(productData.netPriceIncVAT?.toString() || "");
      // Set product images if available
      if (productData.image && Array.isArray(productData.image)) {
        setProductImages(productData.image.map((img: any) => ({ uri: img })));
      }

      if (productData?.productColors?.length > 0) {
        // Transform and set selected colors
        const colors = productData.productColors.map((c: any) => ({
          colorCode: c.colorCode,
          colorName: c.colorName,
        }));
        setIsColorsAvailable(true);
        setSelectedColors(colors);
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

  useEffect(() => {
    calculatePrices();
  }, [netPrice, discount, vatRate, isVatApplicable]);

  const calculatePrices = () => {
    const netPriceNum = parseFloat(netPrice) || 0;
    const discountNum = parseFloat(discount) || 0;

    if (isVatApplicable) {
      const effectiveVatRate = vatRate ? parseFloat(vatRate) : 20.0;
      const VATAmount = (netPriceNum - discountNum) * (effectiveVatRate / 100);
      const netPriceInc_Vat = netPriceNum - discountNum + VATAmount;

      setVatAmount(VATAmount.toFixed(2));
      setNetPriceIncVAT(netPriceInc_Vat.toFixed(2));
      const grossPrice = calculateGrossPrice(netPriceInc_Vat, true);
      setGrossPrice(grossPrice.toFixed(2));
    } else {
      setVatAmount("");
      setNetPriceIncVAT("");

      const grossPrice = calculateGrossPrice(netPriceNum - discountNum, false);
      setGrossPrice(grossPrice.toFixed(2));
    }
  };

  const calculateGrossPrice = (basePrice: number, hasVAT: boolean) => {
    let finalPrice = basePrice;
    return finalPrice;
  };

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

  const validateFields = () => {
    const newErrors: typeof errors = {};

    // Validate product name
    const productNameError = isValidProductName(productName);
    if (productNameError) newErrors.productName = productNameError;

    // Validate title
    // const titleError = isValidProductTitle(title);
    // if (titleError) newErrors.title = titleError;

    // // Validate description
    // const descriptionError = isValidProductDescription(productDescription);
    // if (descriptionError) newErrors.productDescription = descriptionError;

    // Validate stock
    // const stockError = isValidStock(stock);
    // if (stockError) newErrors.stock = stockError;

    // Validate netPrice
    const netPriceError = isValidPrice(netPrice);
    if (netPriceError) newErrors.netPrice = netPriceError;

    // Validate discount
    // const discounteError = isValidDiscountPrice(discount, discount);
    // if (discountError) newErrors.discount = discountError;

    // Validate category
    if (!category) newErrors.category = "Please select a category";

    // Validate minimum order quantity
    // const minOrderQtyError = isValidMinimumOrderQuantity(minimumOrderQunatity);
    // if (minOrderQtyError) newErrors.minimumOrderQunatity = minOrderQtyError;

    // Validate images (only for new products)
    // if (newProduct) {
    //   const imagesError = isValidProductImages(productImages, MAX_IMAGES);
    //   if (imagesError) newErrors.productImages = imagesError;
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductNameChange = (value: string) => {
    setProductName(value);
    if (errors.productName) {
      const error = isValidProductName(value);
      setErrors((prev) => ({ ...prev, productName: error || undefined }));
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // if (errors.title) {
    //   // const error = isValidProductTitle(value);
    //   setErrors((prev) => ({ ...prev, title: error || undefined }));
    // }
  };

  const handleDescriptionChange = (value: string) => {
    setProductDescription(value);
    // if (errors.productDescription) {
    //   const error = isValidProductDescription(value);
    //   setErrors((prev) => ({
    //     ...prev,
    //     productDescription: error || undefined,
    //   }));
    // }
  };

  const handleStockChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, "");
    setStock(numericValue);
    // if (errors.stock) {
    //   const error = isValidStock(numericValue);
    //   setErrors((prev) => ({ ...prev, stock: error || undefined }));
    // }
  };

  const handlePriceChange = (value: string) => {
    // Allow numeric input with up to 2 decimal places
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) return; // Prevent multiple decimal points
    if (parts[1] && parts[1].length > 2) return; // Limit to 2 decimal places

    setNetPrice(numericValue);
    if (errors.netPrice) {
      const error = isValidPrice(parseInt(numericValue));
      setErrors((prev) => ({ ...prev, netPrice: error || undefined }));
    }
  };

  const handleDiscountPriceChange = (value: string) => {
    // Allow numeric input with up to 2 decimal places
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) return; // Prevent multiple decimal points
    if (parts[1] && parts[1].length > 2) return; // Limit to 2 decimal places

    setDiscountPrice(numericValue);
    // if (errors.discount) {
    //   const error = isValidDiscountPrice(numericValue, discount);
    //   setErrors((prev) => ({ ...prev, discount: error || undefined }));
    // }
  };

  const handleMinOrderQuantityChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, "");
    setMinimumOrderQuantity(numericValue);
    // if (errors.minimumOrderQunatity) {
    //   const error = isValidMinimumOrderQuantity(numericValue);
    //   setErrors((prev) => ({
    //     ...prev,
    //     minimumOrderQunatity: error || undefined,
    //   }));
    // }
  };

  const handleVatRateChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setVatRate(numericValue);
  };

  const handleVatAmountChange = (value: string) => {};

  const handleUpdateProduct = useCallback(async () => {
    // Validate fields before submission
    if (!validateFields()) {
      showErrorAlert({
        title: "Let's fix that",
        message: FIX_VALIDATION_ERRORS,
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("selectedColors", selectedColors);

      // Prepare form data
      const formData = new FormData();

      // Append regular text fields
      formData.append("name", productName.trim());
      formData.append("id", id ? id : maxId.toString());
      formData.append("title", title.trim());
      formData.append("description", productDescription.trim());
      formData.append("stock", stock);
      formData.append("netPrice", netPrice);
      formData.append("discount", discount || "0");
      formData.append("categoryId", category);
      formData.append("minimumOrderQuantity", minimumOrderQunatity || "0");
      formData.append("isReturnable", isChecked ? "true" : "false");
      formData.append("isAgeRestricted", isAgeRestricted ? "true" : "false");

      if (isVatApplicable) {
        formData.append("vatRate", vatRate);
        // formData.append("vatAmount", vatAmount);
        // formData.append("grossPrice", grossPrice);
        // formData.append("netPriceIncVAT", netPriceIncVAT);
      }
      formData.append("isVatApplicable", isVatApplicable ? "true" : "false");

      // Handle colors
      if (isColorsAvailable && selectedColors.length > 0) {
        formData.append("productColors", JSON.stringify(selectedColors));
      } else if (color) {
        formData.append("productColors", JSON.stringify([{ color }]));
      } else {
        formData.append("productColors", JSON.stringify([]));
      }

      // Separate existing image URLs and new local image files
      const existingImageUrls = productImages
        .filter((img: any) => !img.uri.startsWith("file://"))
        .map((img: any) => img.uri);

      const newImageFiles = productImages.filter((img: any) =>
        img.uri.startsWith("file://")
      );

      // Send existing Cloudinary URLs to the server
      formData.append("images", JSON.stringify(existingImageUrls));

      // Send new image files (to upload)
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

      console.log("Submitting form data for product update", formData);

      // Make API call based on whether it's a new product or update
      const response = newProduct
        ? await ProductsAPI.addProduct(formData)
        : await ProductsAPI.updateProduct(productData._id, formData);

      if (!response) {
        throw new Error("Failed to update product.");
      }

      // Show success message and redirect
      Alert.alert(
        "Success",
        newProduct
          ? "Product added successfully!"
          : "Product updated successfully!",
        [
          {
            text: "OK",
            onPress: () =>
              clearNavigationStack(containers.AdminProductDashboardScreen),
          },
        ]
      );
    } catch (error) {
      console.error("Error updating product:", error);
      showErrorAlert({
        title: "Oops!",
        message: "Failed to update product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    productName,
    stock,
    netPrice,
    discount,
    category,
    color,
    selectedColors,
    productImages,
    id,
    title,
    productDescription,
    minimumOrderQunatity,
    isChecked,
    isAgeRestricted,
    isVatApplicable,
    vatRate,
    vatAmount,
    grossPrice,
    router,
    newProduct,
    productData?._id,
    maxId,
    isColorsAvailable,
    validateFields,
  ]);
  // Define the predefined colors array
  const predefinedColors = [
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#008000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Purple", hex: "#800080" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#808080" },
    { name: "Navy", hex: "#000080" },
    { name: "Teal", hex: "#008080" },
    { name: "Lime", hex: "#00FF00" },
    { name: "Maroon", hex: "#800000" },
    { name: "Olive", hex: "#808000" },
    { name: "Aqua", hex: "#00FFFF" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Fuchsia", hex: "#FF00FF" },
    { name: "Coral", hex: "#FF7F50" },
  ];
  // Function to handle color selection
  const handleColorSelection = (colorHex: string, colorName: string) => {
    const colorExists = selectedColors.some(
      (color: any) => (color.hex || color.colorCode) === colorHex
    );

    if (colorExists) {
      setSelectedColors(
        selectedColors.filter(
          (color: any) => (color.hex || color.colorCode) !== colorHex
        )
      );
    } else {
      // Add color with consistent structure
      setSelectedColors([
        ...selectedColors,
        {
          hex: colorHex,
          name: colorName,
          colorCode: colorHex,
          colorName: colorName,
        },
      ]);
    }
  };
  console.log("selectedColors just after dropdown", selectedColors);
  const getSelectedColorsText = () => {
    if (selectedColors.length === 0) return "Select colors";
    if (selectedColors.length === 1) {
      const color = predefinedColors.find((c) => c.hex === selectedColors[0]);
      return color?.name || "1 color selected";
    }
    return `${selectedColors.length} colors selected`;
  };

  return (
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
      scrollable={false}
    >
      <KeyBoardWrapper>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={[
              // globalStyles.sectionContent,
              globalStyles.pt_0,
              globalStyles.mt_n3,
            ]}
          >
            <Text style={styles.label}>Product Name *</Text>
            <CustomTextInput
              setValue={handleProductNameChange}
              value={productName}
              onPress={() => {}}
              placeholder="e.g., Premium Wireless Headphones"
              style={errors.productName ? globalStyles.errorInput : undefined}
              maxLength={100}
            />
            {errors.productName && (
              <Text style={globalStyles.errorText}>{errors.productName}</Text>
            )}

            <Text style={styles.label}>Title </Text>
            <CustomTextInput
              value={title}
              setValue={handleTitleChange}
              onPress={() => {}}
              placeholder="e.g., High-Quality Bluetooth Headphones with Noise Cancellation"
              // style={errors.title ? globalStyles.errorInput : undefined}
              maxLength={150}
            />
            {/* {errors.title && (
              <Text style={globalStyles.errorText}>{errors.title}</Text>
            )} */}

            <Text style={styles.label}>Product Description</Text>
            <TextInput
              value={productDescription}
              onChangeText={handleDescriptionChange}
              placeholder="Describe your product features, specifications, and benefits in detail..."
              multiline
              numberOfLines={6}
              style={[
                styles.multilinetextbox,
                // errors.productDescription ? globalStyles.errorInput : undefined,
              ]}
              maxLength={1000}
            />
            <Text style={styles.characterCount}>
              {productDescription.length}/1000 characters
            </Text>
            {/* {errors.productDescription && (
              <Text style={globalStyles.errorText}>
                {errors.productDescription}
              </Text>
            )} */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category *</Text>
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
                {errors.category && (
                  <Text style={globalStyles.errorText}>{errors.category}</Text>
                )}
              </View>
            </View>
            <Text style={styles.label}>Stock </Text>
            <CustomTextInput
              setValue={handleStockChange}
              value={stock}
              onPress={() => {}}
              placeholder="e.g., 100"
              keyboardType="numeric"
              // style={errors.stock ? globalStyles.errorInput : undefined}
              maxLength={5}
            />
            {/* {errors.stock && (
              <Text style={globalStyles.errorText}>{errors.stock}</Text>
            )} */}

            <Text style={styles.label}>Net Price * ({CurrencySymbol})</Text>
            <CustomTextInput
              setValue={handlePriceChange}
              value={netPrice}
              onPress={() => {}}
              placeholder="e.g., 2999.99"
              keyboardType="decimal-pad"
              style={errors.netPrice ? globalStyles.errorInput : undefined}
              maxLength={10}
            />
            {errors.netPrice && (
              <Text style={globalStyles.errorText}>{errors.netPrice}</Text>
            )}

            <Text style={styles.label}>Discount({CurrencySymbol})</Text>
            <CustomTextInput
              setValue={handleDiscountPriceChange}
              value={discount}
              onPress={() => {}}
              placeholder="e.g., 2499.99 (optional - must be less than Net Price)"
              keyboardType="decimal-pad"
              // style={errors.discount ? globalStyles.errorInput : undefined}
              maxLength={10}
            />
            {/* {errors.discount && (
              <Text style={globalStyles.errorText}>{errors.discount}</Text>
            )} */}

            <View style={styles.checkBox}>
              <CheckBox
                checked={isVatApplicable}
                onPress={() => {
                  setIsVatApplicable(!isVatApplicable);
                  if (!isVatApplicable) {
                    setVatRate("20.00");
                    setVatAmount("");
                    setNetPriceIncVAT("");
                    // setGrossPrice("");
                  } else {
                    setVatRate("");
                    setVatAmount(" ");
                    setNetPriceIncVAT("");
                    // setGrossPrice("");
                  }
                }}
                checkedColor={colors.primary}
                uncheckedColor={colors.secondary}
              />
              <Text>Is VAT Applicable?</Text>
            </View>

            {isVatApplicable && (
              <>
                <Text style={styles.label}>VAT Rate (%)</Text>
                <CustomTextInput
                  setValue={handleVatRateChange}
                  value={vatRate}
                  onPress={() => {}}
                  placeholder="e.g., 5.00"
                  keyboardType="decimal-pad"
                  style={errors.vatRate ? globalStyles.errorInput : undefined}
                  maxLength={6}
                />

                <Text style={styles.label}>VAT Amount ({CurrencySymbol})</Text>
                <CustomTextInput
                  setValue={handleVatAmountChange}
                  value={vatAmount}
                  onPress={() => {}}
                  placeholder="eCalculated Automatically"
                  keyboardType="decimal-pad"
                  maxLength={10}
                  editable={false}
                  style={styles.readOnlyInput}
                />

                <Text style={styles.label}>
                  Net Price Including VAT ({CurrencySymbol})
                </Text>
                <CustomTextInput
                  value={netPriceIncVAT}
                  onPress={() => {}}
                  placeholder="Calculated automatically"
                  keyboardType="decimal-pad"
                  maxLength={10}
                  editable={false}
                  style={styles.readOnlyInput}
                />
              </>
            )}

            <Text style={styles.label}>Gross Price ({CurrencySymbol})</Text>
            <CustomTextInput
              value={grossPrice}
              onPress={() => {}}
              placeholder="Calculated Automatically"
              keyboardType="decimal-pad"
              maxLength={10}
              editable={false}
              style={styles.readOnlyInput}
            />

            <Text style={styles.label}>Minimum Order Quantity</Text>
            <CustomTextInput
              setValue={handleMinOrderQuantityChange}
              value={minimumOrderQunatity}
              onPress={() => {}}
              placeholder="e.g., 1 (optional - leave empty for no minimum)"
              keyboardType="numeric"
              // style={
              //   errors.minimumOrderQunatity
              //     ? globalStyles.errorInput
              //     : undefined
              // }
              maxLength={4}
            />
            {/* {errors.minimumOrderQunatity && (
              <Text style={globalStyles.errorText}>
                {errors.minimumOrderQunatity}
              </Text>
            )} */}

            <View style={styles.checkBox}>
              <CheckBox
                checked={isColorsAvailable}
                onPress={() => {
                  setIsColorsAvailable(!isColorsAvailable);
                  if (!isColorsAvailable) {
                    setSelectedColors([]);
                  }
                }}
                checkedColor={colors.primary}
                uncheckedColor={colors.secondary}
              />
              <Text>Colors Available?</Text>
            </View>
            {!newProduct && selectedColors.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {selectedColors.map((color: any, index: any) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0",
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      margin: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: color.hex || color.colorCode,
                        marginRight: 6,
                      }}
                    />
                    <Text>{color.colorName || color.name}</Text>
                  </View>
                ))}
              </View>
            )}
            {isColorsAvailable && (
              <>
                <Text style={styles.label}>Select Color</Text>
                <View style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={styles.categorySelector}
                    onPress={() => setShowColorModal(true)}
                  >
                    <View style={styles.selectedColorsDisplay}>
                      {selectedColors.length > 0 && (
                        <View style={styles.selectedColorCircles}>
                          {selectedColors
                            .slice(0, 3)
                            .map((colorHex: any, index: any) => (
                              <View
                                key={index}
                                style={[
                                  styles.smallColorCircle,
                                  {
                                    backgroundColor:
                                      colorHex.hex || colorHex.colorCode,
                                  },
                                ]}
                              />
                            ))}
                          {selectedColors.length > 3 && (
                            <View style={styles.moreColorsIndicator}>
                              <Text style={styles.moreColorsText}>
                                +{selectedColors.length - 3}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color:
                              selectedColors.length > 0
                                ? selectedColors.map((c: any) => c.hex)
                                : colors.slateGrey,
                          },
                        ]}
                      >
                        {getSelectedColorsText()}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-down-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Modal
                  visible={showColorModal}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowColorModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Colors</Text>
                        <TouchableOpacity
                          onPress={() => setShowColorModal(false)}
                          style={styles.closeButton}
                        >
                          <Ionicons
                            name="close"
                            size={24}
                            color={colors.black}
                          />
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={styles.colorListContainer}>
                        {predefinedColors.map((color, index) => {
                          const isSelected = selectedColors.some(
                            (selectedColor: any) =>
                              (selectedColor.hex || selectedColor.colorCode) ===
                                color.hex ||
                              (selectedColor.name ||
                                selectedColor.colorName) === color.name
                          );

                          return (
                            <TouchableOpacity
                              key={index}
                              style={styles.colorOptionRow}
                              onPress={() =>
                                handleColorSelection(color.hex, color.name)
                              }
                            >
                              <View style={styles.colorOptionContent}>
                                <CheckBox
                                  checked={isSelected}
                                  onPress={() =>
                                    handleColorSelection(color.hex, color.name)
                                  }
                                  checkedColor={colors.primary}
                                  uncheckedColor={colors.secondary}
                                />
                                <View
                                  style={[
                                    styles.colorCircle,
                                    { backgroundColor: color.hex },
                                  ]}
                                />
                                <Text style={styles.colorNameText}>
                                  {color.name} ({color.hex})
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>

                      <View style={styles.modalFooter}>
                        <TouchableOpacity
                          style={styles.clearButton}
                          onPress={() => setSelectedColors([])}
                        >
                          <Text style={styles.clearButtonText}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.doneButton}
                          onPress={() => setShowColorModal(false)}
                        >
                          <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>
            )}
          </View>
          <View style={styles.checkBox}>
            <CheckBox
              checked={isChecked}
              onPress={() => setIsChecked(!isChecked)}
              checkedColor={colors.primary}
              uncheckedColor={colors.secondary}
            />
            <Text>Returnable?</Text>
            <CheckBox
              checked={isAgeRestricted}
              onPress={() => setIsAgeRestricted(!isAgeRestricted)}
              checkedColor={colors.primary}
              uncheckedColor={colors.secondary}
            />
            <Text>Age Restricted?</Text>
          </View>
          {/* <View style={styles.checkBox}>
           
          </View> */}

          <Text style={[styles.label, globalStyles.mt_4]}>Product Images</Text>
          <Text style={styles.subLabel}>Upload up to {MAX_IMAGES} images</Text>

          <View style={styles.imageContainer}>
            {/* Display existing images */}
            {productImages.map((img: any, index: any) => (
              <View key={`img-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.productImage} />
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
          {/* </View> */}
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
    marginTop: 14,
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
    backgroundColor: colors.placeholdergrey,
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
  readOnlyInput: {
    backgroundColor: colors.lightgrey,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 10,
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
    marginBottom: -16,
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
  colorScrollView: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  colorOptionContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  colorCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.lightgrey,
  },
  colorText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  selectedColorsContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: colors.offWhite,
    borderRadius: 8,
  },
  selectedColorsLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  selectedColorsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedColorChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightgrey,
  },
  selectedColorPreview: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
    borderWidth: 1,
    borderColor: colors.lightgrey,
  },
  selectedColorName: {
    fontSize: 12,
    color: colors.black,
  },
  selectedColorsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedColorCircles: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  smallColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: colors.lightgrey,
  },
  moreColorsIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.lightgrey,
    justifyContent: "center",
    alignItems: "center",
  },
  moreColorsText: {
    fontSize: 8,
    color: colors.black,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  closeButton: {
    padding: 4,
  },
  colorListContainer: {
    maxHeight: 400,
    paddingHorizontal: 16,
  },
  colorOptionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  colorOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.lightgrey,
  },
  colorNameText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightgrey,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  clearButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  doneButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  characterCount: {
    fontSize: 12,
    color: colors.darkGray,
    textAlign: "right",
    marginTop: 4,
    marginBottom: 8,
  },
});

export default AdminProductUpdation;
