import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../../components/commonComponents/Button";
import ProductRating from "../../components/ProductRating";
import products from "../../data/products";
import colors from "../config/colors";
import styles from "./productDetailScreenStyles";

const ProductDetailScreen = () => {
  const { productId } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);

  // Find the product based on the ID
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  /* const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={star <= rating} />
        ))}
      </View>
    );
  }; */

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header headerText={"About the Product"} />
        <View style={styles.imageContainer}>
          <Image
            source={product.image}
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
                router.push({
                  pathname: "/cartScreen/cartScreen",
                  params: { productId: product.id },
                });
              }}
              style={styles.button}
            />
            {/*  <Button title="Buy Now" onPress={() => {}} style={styles.button} /> */}
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>What do Customers say?</Text>
          {product.reviews.map((review) => (
            <ProductRating key={review.id} review={review} />
          ))}
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() =>
              router.push({
                pathname: "/reviewsScreen/reviewsScreen",
                params: { productId: product.id },
              })
            }
          >
            <Text style={styles.seeMoreText}>See More Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer activeTab="home" />
    </View>
  );
};

export default ProductDetailScreen;
