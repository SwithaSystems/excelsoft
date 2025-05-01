import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
} from "react-native";
import Button from "../../components/commonComponents/Button";
import ProductRating from "../../components/ProductRating";
import colors from "../config/colors";
import styles from "./productDetailScreenStyles";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Product, ProductsAPI } from "@/services/productService";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import DisplayPrice from "@/components/DisplayPrice";
const { width } = Dimensions.get("window");

const ProductDetailScreen = () => {
  const { productId } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const dispatch = useDispatch();

  const fetchProduct = async () => {
    try {
      const fetchedProduct = await ProductsAPI.getProductBYID(
        Number(productId)
      );
      setProduct(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product when component mounts
  useEffect(() => {
    if (!productId) return;
    fetchProduct();
  }, [productId]);

  // Refresh product data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (productId) {
        fetchProduct();
      }
    }, [productId])
  );

  // useEffect(() => {
  //   if (!product?.image?.length || !scrollViewRef.current) return;

  //   let isCancelled = false;

  //   const scrollNextImage = () => {
  //     setCurrentIndex((prevIndex) => {
  //       const nextIndex =
  //         prevIndex + 1 === product.image.length ? 0 : prevIndex + 1;

  //       if (scrollViewRef.current) {
  //         scrollViewRef.current.scrollTo({
  //           x: nextIndex * width,
  //           animated: true,
  //         });
  //       }

  //       if (!isCancelled) {
  //         setTimeout(scrollNextImage, 3000);
  //       }

  //       return nextIndex;
  //     });
  //   };

  //   const timeoutId = setTimeout(scrollNextImage, 3000);

  //   return () => {
  //     isCancelled = true;
  //     clearTimeout(timeoutId);
  //   };
  // }, [product?.image]);
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

  if (loading) {
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

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Header headerText={"About the Product"} />
        <View style={{ position: "relative" }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            // onScroll={(event) => {
            //   const index = Math.floor(event.nativeEvent.contentOffset.x / width);
            //   setCurrentIndex(index);
            // }}
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
                <Image source={{ uri: imageUrl }} style={styles.productImage} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.dotContainer}>
            {product.image.map((_: any, index: number) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.exclusiveDetails}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.starIcon}> ★ </Text>
              <Text style={styles.reviewsText}>({product.reviews.length})</Text>
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
                  {/*product.discount || */ "20%"}
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

          { (product.productColors && product.productColors.length > 0) && <><View style={styles.colorSection}>
            <Text style={styles.colorTitle}>Select Color</Text>
            <View style={styles.colorOptions}>
              {product.productColors.map((color: any) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption,
                  ]}
                />
              ))}
            </View> 
          </View> </>}

          <View style={styles.quantitySection}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityTitle}>Quantity</Text>
              {/* <TouchableOpacity>
                <Text style={styles.selectQuantityText}>select quantity</Text>
              </TouchableOpacity> */}
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
                onPress={() => setQuantity(quantity + 1)}
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
                  dispatch(
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: quantity,
                      image: product.image,
                    })
                  );
                }
              }}
              style={styles.button}
            />
            {/*  <Button title="Buy Now" onPress={() => {}} style={styles.button} /> */}
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>What do Customers say?</Text>
          {[...product.reviews]
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 5)
            .map((review: any) => (
              <ProductRating key={review.id} review={review} />
            ))}
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() =>
              redirectToPage(containers.reviewsScreenScreen, {
                productId: productId,
                totalReviews: JSON.stringify(product.reviews),
                productRating: product.rating,
              })
            }
          >
            <Text style={styles.seeMoreText}>See More Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer navigation={router} activeTab="home" />
    </View>
  );
};

export default ProductDetailScreen;
