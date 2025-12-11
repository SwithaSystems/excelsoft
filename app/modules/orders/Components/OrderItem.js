import colors from "@/constants/colors";
import { globalStyles } from "@/assets/styles/globalStyles";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { format } from "date-fns";

function OrderItem(props) {
  const item = props.item;
  const isTabOrDesktop = props.isTabOrDesktop || false;
  // console.log("item", item);

  // Format delivery date for web view
  const formatDeliveryDate = (deliveryDate) => {
    if (!deliveryDate) return item.date || "N/A";
    
    try {
      const date = new Date(deliveryDate);
      const day = date.getDate();
      const month = format(date, "MMMM");
      const dayOfWeek = format(date, "EEE");
      const hour = date.getHours();
      const minute = date.getMinutes();
      
      // Format time in 12-hour format
      const period = hour >= 12 ? "P.M." : "A.M.";
      let displayHour = hour % 12;
      if (displayHour === 0) displayHour = 12;
      
      // Create time range (e.g., 10 A.M.- 11 A.M.)
      const endHour = (hour + 1) % 12 || 12;
      const endPeriod = (hour + 1) >= 12 ? "P.M." : "A.M.";
      
      return `Delivered on: ${day} th ${month}, ${dayOfWeek}, ${displayHour} ${period}- ${endHour} ${endPeriod}`;
    } catch (error) {
      return item.date || "N/A";
    }
  };

  // Get product images (max 4 for preview)
  const getProductImages = () => {
    if (!item.products || item.products.length === 0) return [];
    return item.products.slice(0, 4);
  };

  const productImages = getProductImages();
  const hasMoreProducts = item.products && item.products.length > 4;

  // Get status display text
  const getStatusText = () => {
    if (item.status === "Delivered" || item.status === "delivered") {
      return "Delivered Successfully!";
    }
    return item.status || "Processed";
  };

  // Web-specific layout
  if (isTabOrDesktop) {
    return (
      <View style={styles.webOrderContainer}>
        <View style={styles.webOrderContent}>
          {/* Left Section - Delivery Info, Images, Order Details */}
          <View style={styles.webLeftSection}>
            {/* Delivery Date */}
            <Text style={styles.webDeliveryDate}>
              {formatDeliveryDate(item.deliveryDate)}
            </Text>

            {/* Product Images */}
            <View style={styles.webProductImagesContainer}>
              {productImages.map((product, index) => {
                let imageSource;
                if (product.image) {
                  if (typeof product.image === "string" && product.image !== "") {
                    imageSource = { uri: product.image };
                  } else if (Array.isArray(product.image) && product.image.length > 0) {
                    const firstImage = product.image[0];
                    imageSource = typeof firstImage === "string" 
                      ? { uri: firstImage } 
                      : firstImage;
                  } else if (typeof product.image === "object" && product.image.uri) {
                    imageSource = product.image;
                  } else {
                    imageSource = require("../../../../assets/Placeholder.png");
                  }
                } else {
                  imageSource = require("../../../../assets/Placeholder.png");
                }
                
                return (
                  <View key={`${product.productId || index}-${index}`} style={styles.webProductImageWrapper}>
                    <Image
                      source={imageSource}
                      style={styles.webProductImage}
                      resizeMode="cover"
                    />
                  </View>
                );
              })}
              {hasMoreProducts && (
                <View style={[styles.webProductImageWrapper, styles.webMoreProducts]}>
                  <Text style={styles.webMoreProductsText}>+ more</Text>
                </View>
              )}
            </View>

            {/* Order Details */}
            <View style={styles.webOrderDetails}>
              <Text style={styles.webOrderDetailText}>
                <Text style={styles.webOrderDetailLabel}>Order ID:</Text>{" "}
                <Text style={styles.webOrderDetailValue}>{item.orderId}</Text>
              </Text>
              <Text style={styles.webOrderDetailText}>
                <Text style={styles.webOrderDetailLabel}>Total Items:</Text>{" "}
                <Text style={styles.webOrderDetailValue}>{item.totalItems}</Text>
              </Text>
              <Text style={styles.webOrderDetailText}>
                <Text style={styles.webOrderDetailLabel}>Subtotal:</Text>{" "}
                <Text style={styles.webOrderDetailValue}>${item.subtotal}</Text>
              </Text>
            </View>
          </View>

          {/* Right Section - Status and Action */}
          <View style={styles.webRightSection}>
            <View style={styles.webStatusContainer}>
              <Ionicons name="bag-check" size={20} color={colors.primary} />
              <Text style={styles.webStatusText}>{getStatusText()}</Text>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                // Navigate to order details
                redirectToPage(containers.orderDetailsScreen, {
                  orderId: item._id,
                  from: props.from,
                });
              }}
            >
              <Text style={styles.webOrderDetailsLink}>Order Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Mobile layout (existing)
  return (
    <TouchableOpacity
      onPress={() => {
        redirectToPage(containers.orderDetailsScreen, {
          orderId: item._id,
          from: props.from,
        });
      }}
    >
      <View style={styles.orderContainer}>
        <View style={styles.OrderIdContainer}>
          <Text style={styles.orderSummaryItems}>
            <Text style={styles.prefix}>Order ID:</Text> {item.orderId}
          </Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              e.preventDefault();
              redirectToPage(containers.deliveryTrackingScreen, {
                orderId: item._id,
              });
            }}
          >
            <Text style={styles.navigationText}>Track Order</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.dateTimeContainer]}>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.OrderStatusContainer}>
          <View style={styles.statusContainer}>
            <Ionicons name="bag-check" size={32} color={colors.primary} />
            <Text style={styles.status}>{item.status}</Text>
          </View>
          <Text style={styles.navigationText}>See More</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  orderContainer: {
    marginBottom: 24,
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  OrderIdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    fontWeight: "300",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  OrderStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderSummaryItems: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 500,
  },
  prefix: {
    fontWeight: "bold",
  },
  itemsSubtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  trackButton: {
    backgroundColor: "lightblue", // Or your preferred color for the button
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  trackButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  navigationText: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  // Web-specific styles
  webOrderContainer: {
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
  },
  webOrderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  webLeftSection: {
    flex: 1,
    marginRight: 20,
  },
  webDeliveryDate: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 6,
    fontWeight: "bold",
  },
  webProductImagesContainer: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 6,
  },
  webProductImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: colors.lightgrey,
  },
  webProductImage: {
    width: "100%",
    height: "100%",
  },
  webMoreProducts: {
    backgroundColor: colors.lightgrey,
    justifyContent: "center",
    alignItems: "center",
  },
  webMoreProductsText: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  webOrderDetails: {
    gap: 2,
  },
  webOrderDetailText: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 1,
  },
  webOrderDetailLabel: {
    fontWeight: "bold",
  },
  webOrderDetailValue: {
    fontWeight: "normal",
  },
  webRightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: 160,
  },
  webStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  webStatusText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: "600",
  },
  webOrderDetailsLink: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default OrderItem;
