import Footer from "@/app/components/Footer";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
  useWindowDimensions,
} from "react-native";
import Button from "../../components/commonComponents/Button";
import ProductRating from "../../components/ProductRating";
import colors from "../../../constants/colors";
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
import {
  addToSavedItems,
  removeFromSavedItems,
} from "@/store/slices/savedItemsSlice";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import HeroBanner from "../../components/HeroBanner";
import { PRODUCT_DETAIL_SCREEN_TITLE } from "../../../constants/stringLiterals";
import {
  ITEM_OUT_OF_STOCK,
  QUANTITY_NOT_AVAILABLE,
} from "../../../constants/customErrorMessages";
import { showErrorAlert } from "../../../utilities/showErrorAlert";
import styles from "./ProductDetailStyles";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";

const ProductDetailScreen = () => {
  const { productId } = useLocalSearchParams();
  const { from } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [toast, setToast] = useState<{ text1: String; text2?: string } | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";
  
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

  const fetchProduct = useCallback(async () => {
    try {
      setIsProductLoading(true);
      setErrorMessage(null);
      const fetchedProduct = await ProductsAPI.getProductBYID(
        Number(productId)
      );
      console.log("fetched product", fetchedProduct);
      if (!fetchedProduct) {
        setErrorMessage("Product not found");
        if (from === "savedItemScreen") {
          const savedItem = savedItems.find(
            (item: any) => item.id === Number(productId)
          );
          if (savedItem) {
            dispatch(removeFromSavedItems(savedItem.id));
          }
        }
        return;
      }

      setProduct(fetchedProduct);

      if (fetchedProduct?.productColors?.length) {
        setSelectedColor(fetchedProduct.productColors[0]);
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);

      if (error?.response?.status === 404) {
        setErrorMessage("Product not found");
        if (from === "savedItemScreen") {
          const savedItem = savedItems.find(
            (item: any) => item.id === Number(productId)
          );
          if (savedItem) {
            dispatch(removeFromSavedItems(savedItem.id));
          }
        }
      } else if (error?.response?.status === 401) {
        setErrorMessage("Unauthorized. Please login again.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setIsProductLoading(false);
    }
  }, [productId, setIsProductLoading, from, savedItems, dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (productId) {
        fetchProduct();
      }
    }, [fetchProduct, productId])
  );

  const indexRef = useRef(0);

  useEffect(() => {
    if (
      !product?.image?.length ||
      !scrollViewRef.current ||
      Platform.OS === "web"
    )
      return;

    const interval = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % product?.image?.length;

      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });

      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [product?.image?.length]);

  if (isProductLoading) {
    return (
      <PageLayout
        scrollable={false}
        hasHeader
        hasFooter={false}
        headerComponent={<Header headerText={PRODUCT_DETAIL_SCREEN_TITLE} />}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </PageLayout>
    );
  }

  if (errorMessage) {
    return (
      <PageLayout hasHeader scrollable={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout hasHeader scrollable={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not available</Text>
        </View>
      </PageLayout>
    );
  }

  const showToast = (text1: string, text2?: string) => {
    setToast({ text1, text2 });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={PRODUCT_DETAIL_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? (
    <FooterWeb />
  ) : (
    <Footer/>
  );


  // Web Layout
  // if (isWeb) {
  //   return (
  //     <PageLayout
  //       scrollable
  //       hasHeader
  //       hasFooter
  //       headerComponent={<Header headerText={PRODUCT_DETAIL_SCREEN_TITLE} />}
  //       footerComponent={<Footer />}
  //     >
  //       <View style={styles.webContainer}>
          
  //       </View>
  //     </PageLayout>
  //   );
  // }

  // Mobile Layout (Original)
  return (
  <LayoutComponent
    scrollable
    hasHeader
    hasFooter
    headerComponent={HeaderComponent}
    footerComponent={FooterComponent}
  >
    {isTabOrDesktop ? (
      <View style={styles.webContainer}>
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.webContentWrapper}>
              {/* Left Section - Images */}
              <View style={styles.webLeftSection}>

                {/* Main Image */}
                <View style={styles.webMainImageContainer}>
                  <Image
                    source={{
                      uri:
                        product?.image?.[selectedImageIndex] ||
                        product?.image?.[0],
                    }}
                    style={styles.webMainImage}
                  />
                </View>

                {/* Thumbnail Images */}
                <View style={styles.webThumbnailContainer}>
                  {product?.image
                    ?.filter((url: string) => url && url.trim() !== "")
                    .map((imageUrl: string, index: number) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedImageIndex(index)}
                        style={[
                          styles.webThumbnail,
                          selectedImageIndex === index &&
                            styles.webThumbnailActive,
                        ]}
                      >
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.webThumbnailImage}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              </View>


              {/* Right Section - Product Details */}
              <View style={styles.webRightSection}>
                <View style={styles.webProductHeader}>
                  <Text style={styles.webProductTitle}>{product.name}</Text>
                  <TouchableOpacity
                    onPress={(e) => handleHeartPress(e, product)}
                  >
                    <Ionicons
                      name={isItemSaved(product.id) ? "heart" : "heart-outline"}
                      size={24}
                      color={
                        isItemSaved(product.id)
                          ? colors.primaryRed
                          : colors.black
                      }
                    />
                  </TouchableOpacity>
                </View>

                {product.reviews.length > 0 && (
                  <View style={styles.webRatingContainer}>
                    <Text style={styles.webRatingText}>{product.rating}</Text>
                    <Text style={styles.webStarIcon}> ★ </Text>
                    <Text style={styles.webReviewsText}>
                      ({product?.reviews?.length || 0})
                    </Text>
                  </View>
                )}

                {/* Sale Badge and Discount */}
                {product.netPrice > product.discount && (
                  <View style={styles.webSaleContainer}>
                    <View style={styles.webSaleTag}>
                      <Text style={styles.webSaleText}>Sale</Text>
                    </View>
                    <View style={styles.webTimerBadge}>
                      <Text style={styles.webTimerText}>02:48:26</Text>
                    </View>
                    <View style={styles.webDiscountBadge}>
                      <Text style={styles.webDiscountText}>
                        {((product.discount * 100) / product.netPrice).toFixed(
                          0
                        )}
                        %
                      </Text>
                    </View>
                  </View>
                )}

                {/* Price */}
                <View style={styles.webPriceContainer}>
                  <DisplayPrice
                    discount={product.discount}
                    netPrice={product.netPrice}
                  />
                </View>

                {/* Select Color */}
                {product.productColors && product.productColors?.length > 0 && (
                  <View style={styles.webColorSection}>
                    <Text style={styles.webSectionTitle}>Select Color</Text>
                    <View style={styles.webColorOptions}>
                      {product.productColors.map((color: any) => (
                        <TouchableOpacity
                          key={color._id}
                          onPress={() => setSelectedColor(color)}
                          style={[
                            styles.webColorOption,
                            { backgroundColor: color.colorCode },
                            selectedColor?._id === color._id &&
                              styles.webColorOptionActive,
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                )}

                {/* Quantity */}
                <View style={styles.webQuantitySection}>
                  <Text style={styles.webSectionTitle}>Quantity</Text>
                  <View style={styles.webQuantityControl}>
                    <TouchableOpacity
                      style={styles.webQuantityButton}
                      onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <Ionicons name="remove" size={20} color={colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.webQuantityText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.webQuantityButton}
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

                {/* Add to Cart Button */}
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
                          _id: product && product._id ? product._id : "",
                          id: product.id,
                          name: product.name,
                          discount: product.discount,
                          quantity: quantity,
                          image: product.image,
                          netPrice: product.netPrice,
                          isVatApplicable: product.isVatApplicable,
                          vatRate: product.vatRate,
                          vatAmount: product.vatAmount,
                        })
                      );
                      Toast.show({
                        type: "customToast",
                        text1: "Product added successfully!",
                        text2: `${product.name} - ${product.discount}`,
                        visibilityTime: 1000,
                        autoHide: true,
                        onPress: () => {
                          redirectToPage(containers.cartScreen);
                        },
                      });
                    }
                  }}
                  style={styles.webAddToCartButton}
                />

                {/* Product Information */}
                <View style={styles.webProductInfo}>
                  <Text style={styles.webInfoTitle}>Product Information</Text>
                  <Text style={styles.webInfoText}>{product.description}</Text>
                </View>
              </View>
            </View>

            {/* Reviews Section - Full Width */}
            <View style={styles.webReviewsSection}>
              <View style={styles.webReviewsHeader}>
                <Text style={styles.webReviewsTitle}>
                  What do Customers say?
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    redirectToPage(containers.feedbackScreen, {
                      productId: productId,
                    })
                  }
                >
                  <Text style={styles.webAddReviewText}>Add your Review</Text>
                </TouchableOpacity>
              </View>

              {[...(product.reviews || [])]
                .sort((a, b) => Number(b.id) - Number(a.id))
                .slice(0, 5)
                .map((review: any, index: number) => (
                  <ProductRating
                    key={`${review.id ?? "review"}-${index}`}
                    review={review}
                  />
                ))}

              {product.reviews?.length > 0 && (
                <TouchableOpacity
                  style={styles.webSeeMoreButton}
                  onPress={() =>
                    redirectToPage(containers.reviewsScreen, {
                      productId: productId,
                      totalReviews: JSON.stringify(product.reviews),
                      productRating:
                        JSON.stringify(product.rating) || product.rating,
                    })
                  }
                >
                  <Text style={styles.webSeeMoreText}>See More Reviews</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

      </View>
    ) : (

      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          {product && product?.image && product?.image?.length > 0 && (
            <HeroBanner
              bannerData={product?.image
                .filter((url: string) => url && url.trim() !== "")
                .map((imageurl: string, index: number) => ({
                  id: index,
                  image: { uri: imageurl },
                }))}
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
                    color={
                      isItemSaved(product.id) ? colors.primaryRed : colors.black
                    }
                  />
                </TouchableOpacity>
              </View>
              {product.reviews.length > 0 && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{product.rating}</Text>
                  <Text style={styles.starIcon}> ★ </Text>
                  <Text style={styles.reviewsText}>
                    ({product?.reviews?.length || 0})
                  </Text>
                </View>
              )}

              <View style={styles.priceContainer}>
                <DisplayPrice
                  discount={product.discount}
                  netPrice={product.netPrice}
                />
              </View>
            </View>

            <Text style={styles.infoTitle}>Product Information</Text>
            <Text style={styles.infoText}>{product.description}</Text>

            {product.productColors && product.productColors?.length > 0 && (
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
                </View>
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
                        _id: product && product._id ? product._id : "",
                        id: product.id,
                        name: product.name,
                        discount: product.discount,
                        quantity: quantity,
                        image: product.image,
                        netPrice: product.netPrice,
                        isVatApplicable: product.isVatApplicable,
                        vatRate: product.vatRate,
                        vatAmount: product.vatAmount,
                      })
                    );
                    Toast.show({
                      type: "customToast",
                      text1: "Product added successfully!",
                      text2: `${product.name} - ${product.discount}`,
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
            </View>
          </View>

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>What do Customers say?</Text>
              <TouchableOpacity
                onPress={() =>
                  redirectToPage(containers.feedbackScreen, {
                    productId: productId,
                  })
                }
              >
                <Text style={styles.addReviewText}>Add Review</Text>
              </TouchableOpacity>
            </View>
            {[...(product.reviews || [])]
              .sort((a, b) => Number(b.id) - Number(a.id))
              .slice(0, 5)
              .map((review: any, index: number) => (
                <ProductRating
                  key={`${review.id ?? "review"}-${index}`}
                  review={review}
                />
              ))}
            {product.reviews?.length > 0 && (
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
            )}
          </View>
        </ScrollView>
      </View>
    )}
    </LayoutComponent>
  );
};

export default ProductDetailScreen;
