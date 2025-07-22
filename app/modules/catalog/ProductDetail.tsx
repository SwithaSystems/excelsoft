import Footer from "@/app/components/Footer";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import Button from "../../components/commonComponents/Button";
import ProductRating from "../../components/ProductRating";
import colors from "../../config/colors";
// import styles from "../../../productDetail/productDetailScreenStyles";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Product, ProductsAPI } from "@/services/productService";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../store/slices/cartSlice";
import DisplayPrice from "@/app/components/DisplayPrice";
const { width } = Dimensions.get("window");
import { useAppContext } from "@/context/AppContext";
import Toast from "react-native-toast-message";
import { globalStyles } from "@/assets/styles/globalStyles";
import CustomToastAlert from "@/app/components/commonComponents/CustomToastAlert";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  addToSavedItems,
  removeFromSavedItems,
} from "@/store/slices/savedItemsSlice";
import PageLayout from "../../pageLayoutProps";
import HeroBanner from "../../components/HeroBanner";
import { PRODUCT_DETAIL_SCREEN_TITLE } from "../../config/stringLiterals";
import {
  ITEM_OUT_OF_STOCK,
  QUANTITY_NOT_AVAILABLE,
} from "../../config/customErrorMessages";
import { showErrorAlert } from "../../config/showErrorAlert";
import styles from "./ProductDetailStyles";

const ProductDetailScreen = () => {
  const { productId } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { isLoading, setIsLoading } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [toast, setToast] = useState<{ text1: String; text2?: string } | null>(
    null
  );

  const dispatch = useDispatch();
  const savedItems = useSelector((state: any) => state.savedItems?.items || []);
  const isItemSaved = (itemId: any) => {
    return savedItems.some((savedItem: any) => savedItem.id === itemId);
  };
  const handleHeartPress = (e: any, item: any) => {
    e.stopPropagation();
    console.log("saved item", item);

    if (isItemSaved(item.id)) {
      dispatch(removeFromSavedItems(item.id));
    } else {
      dispatch(addToSavedItems(item));
    }
  };

  // const fetchProduct = async () => {
  //   try {
  //     const fetchedProduct = await ProductsAPI.getProductBYID(
  //       Number(productId)
  //     );
  //     setProduct(fetchedProduct);
  //     if (fetchedProduct?.productColors?.length) {
  //       setSelectedColor(fetchedProduct.productColors[0]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching product:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // console.log("fetched product", product);
  // useFocusEffect(
  //   useCallback(() => {
  //     if (productId) {
  //       fetchProduct();
  //     }
  //   }, [productId])
  // );

  const fetchProduct = useCallback(async () => {
    try {
      const fetchedProduct = await ProductsAPI.getProductBYID(
        Number(productId)
      );
      setProduct(fetchedProduct);
      if (fetchedProduct?.productColors?.length) {
        setSelectedColor(fetchedProduct.productColors[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      if (productId) {
        fetchProduct();
      }
    }, [fetchProduct, productId])
  );

  const indexRef = useRef(0);

  useEffect(() => {
    if (!product?.image?.length || !scrollViewRef.current) return;

    const interval = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % product.image.length;

      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });

      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [product?.image?.length]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const showToast = (text1: string, text2?: string) => {
    setToast({ text1, text2 });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    <PageLayout
      scrollable
      hasHeader
      hasFooter
      headerComponent={<Header headerText={PRODUCT_DETAIL_SCREEN_TITLE} />}
      footerComponent={<Footer />}
    >
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          {/* <Header headerText={"About the Product"} /> */}
          {/* <View style={{ position: "relative" }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={(event) => {
                const index = Math.floor(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentIndex(index);
              }}
              onMomentumScrollEnd={(event) => {
                const index = Math.floor(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentIndex(index);
              }}
            >
              {product.image.map((imageUrl: any, index: any) => (
                <View
                  key={index}
                  style={{
                    width: width,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                  }}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.productImage}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.dotContainer}>
              {product.image.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View> */}

          {product && product.image && product.image.length > 0 && (
            <HeroBanner
              bannerData={product.image.map(
                (imageurl: string, index: number) => ({
                  id: index,
                  image: { uri: imageurl },
                })
              )}
              onBannerPress={() => {}}
            />
          )}

          <View style={styles.contentContainer}>
            <View style={styles.exclusiveDetails}>
              <View style={globalStyles.savedContainer}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <TouchableOpacity onPress={(e) => handleHeartPress(e, product)}>
                  <Ionicons
                    name={isItemSaved(product.id) ? "heart" : "heart-outline"}
                    size={20}
                    color={isItemSaved(product.id) ? colors.red : colors.black}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{product.rating}</Text>
                <Text style={styles.starIcon}> ★ </Text>
                <Text style={styles.reviewsText}>
                  ({product.reviews.length})
                </Text>
              </View>
              <View style={styles.saleContainer}>
                <View style={styles.saleTimeBox}>
                  <View style={styles.saleTag}>
                    <Text style={styles.saleText}>Sale</Text>
                  </View>
                  <Text style={styles.saleTime}>02:48:26</Text>
                </View>
                <View style={styles.discountTag}>
                  <Text style={styles.discountText}>
                    {(product.originalPrice - product.price).toFixed(0) + "%" ||
                      "20%"}
                  </Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <DisplayPrice
                  price={product.price}
                  originalPrice={product.originalPrice}
                />
              </View>
            </View>

            <Text style={styles.infoTitle}>Product Information</Text>
            <Text style={styles.infoText}>{product.description}</Text>

            {product.productColors && product.productColors.length > 0 && (
              <>
                <View style={styles.colorSection}>
                  <Text style={styles.colorTitle}>Select Color</Text>
                  <View style={styles.colorOptions}>
                    {product.productColors.map((color: any) => (
                      <TouchableOpacity
                        key={color._id}
                        onPress={() => setSelectedColor(color)}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color.colorCode },
                          selectedColor?._id === color._id &&
                            styles.selectedColorOption,
                        ]}
                      />
                    ))}
                  </View>
                </View>{" "}
              </>
            )}

            <View style={styles.quantitySection}>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityTitle}>Quantity</Text>
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  <Ionicons name="remove" size={20} color={colors.black} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    const available = product?.stock || 0;
                    if (quantity + 1 > available) {
                      const message = QUANTITY_NOT_AVAILABLE.replace(
                        "{{available}}",
                        available.toString()
                      );

                      showErrorAlert({
                        title: "Limited Stock Alert",
                        message,
                      });
                      return;
                    }
                    setQuantity(quantity + 1);
                  }}
                >
                  <Ionicons name="add" size={20} color={colors.black} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <Button
                title="Add To Cart"
                onPress={() => {
                  if (product) {
                    if (product.stock === 0) {
                      showErrorAlert({
                        title: "Out of Stock",
                        message: ITEM_OUT_OF_STOCK,
                      });
                      return;
                    }
                    dispatch(
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: quantity,
                        image: product.image,
                        originalPrice: product.originalPrice,
                        discount: product.originalPrice - product.price,
                      })
                    );
                    Toast.show({
                      type: "customToast",
                      text1: "Product added successfully!",
                      text2: `${product.name} - ${product.price}`,
                      visibilityTime: 1000,
                      autoHide: true,
                      onPress: () => {
                        redirectToPage(containers.cartScreen);
                      },
                    });
                  }
                }}
                style={styles.button}
              />
              {/*  <Button title="Buy Now" onPress={() => {}} style={styles.button} /> */}
            </View>
          </View>

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>What do Customers say?</Text>
              {/* <Text style={styles.addReviewText}>see more</Text> */}
            </View>
            {[...product.reviews]
              .sort((a, b) => Number(b.id) - Number(a.id))
              .slice(0, 5)
              .map((review: any, index: number) => (
                <ProductRating
                  key={`${review.id ?? "review"}-${index}`}
                  review={review}
                />
              ))}

            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() =>
                redirectToPage(containers.reviewsScreen, {
                  productId: productId,
                  totalReviews: JSON.stringify(product.reviews),
                  productRating:
                    JSON.stringify(product.rating) || product.rating,
                })
              }
            >
              <Text style={styles.seeMoreText}>See More Reviews</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </PageLayout>

    /* <Footer navigation={router} />
      </View>
    </SafeAreaView> */
  );
};

export default ProductDetailScreen;
