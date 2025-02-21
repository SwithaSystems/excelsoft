import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../../components/commonComponents/Button";
import ProductRating from "../../components/ProductRating";
import colors from "../config/colors";
import styles from "./productDetailScreenStyles";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Product, ProductsAPI } from "@/services/productService";

const ProductDetailScreen = () => {
  const { productId } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  // Find the product based on the ID
  useEffect(() => {
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

    fetchProduct();
  }, [productId]);

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
      <ScrollView>
        <Header headerText={"About the Product"} />
        <View style={styles.imageContainer}>
          <Image
            source={product.image[0]}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>${product.price}</Text>
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
          </View>

          <Text style={styles.infoTitle}>Product Information</Text>
          <Text style={styles.infoText}>{product.description}</Text>

          <View style={styles.colorSection}>
            <Text style={styles.colorTitle}>Select Color</Text>
            <View style={styles.colorOptions}>
              {product.productColors.map((color) => (
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
          </View>

          <View style={styles.quantitySection}>
            <Text style={styles.quantityTitle}>Quantity</Text>
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
                redirectToPage(containers.cartScreenScreen);
              }}
              style={styles.button}
            />
            {/*  <Button title="Buy Now" onPress={() => {}} style={styles.button} /> */}
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>What do Customers say?</Text>
          {product.reviews.slice(0, 5).map((review) => (
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
