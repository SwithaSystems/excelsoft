import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../../components/Header";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import AdminFooter from "@/app/components/AdminFooter";
import Button from "@/app/components/commonComponents/Button";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { ProductsAPI } from "@/services/productService";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import CurrencySymbol from "@/constants/CurrencySymbol";
import colors from "../../../constants/colors";
import {
  DELIVERY_MODE_HOME,
} from "../../../constants/stringLiterals";
import styles from "./AdminOrderConfirmationStyles";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";

const placeholderImage = require("../../../assets/Placeholder.png");

const AdminOrderConfirmation = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const { orderId } = useLocalSearchParams();
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  const getErrorMessage = (error: any, fallback: string) => {
    const message = error?.response?.data?.message || fallback;
    return Array.isArray(message) ? message.join("\n") : message;
  };

  const loadOrderDetails = useCallback(async () => {
    if (!orderId) return;

    try {
      setIsLoadingOrder(true);
      const response = await orderService.getOrderByMongoId(String(orderId));
      setOrderDetails(response);
    } catch (error) {
      console.error("Failed to load confirmation order details:", error);
      showAlert("Error", "Failed to load order details.");
    } finally {
      setIsLoadingOrder(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrderDetails();
  }, [loadOrderDetails]);

  useEffect(() => {
    const fetchShippingAddress = async () => {
      if (!orderDetails?.shippingAddress) return;

      try {
        const response = await addressService.getAddressById(
          orderDetails.shippingAddress
        );
        setShippingAddress(response);
      } catch (error) {
        console.error("Failed to fetch shipping address:", error);
      }
    };

    void fetchShippingAddress();
  }, [orderDetails?.shippingAddress]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!orderDetails?.products?.length) return;

      try {
        const detailedCartItems = await Promise.all(
          orderDetails.products.map(async (item: any) => {
            try {
              const productDetails = await ProductsAPI.getProductBYID(
                item.productId
              );
              return {
                ...item,
                image: productDetails?.image,
              };
            } catch (error) {
              console.error(
                `Failed to fetch product details for ${item.productId}:`,
                error
              );
              return item;
            }
          })
        );
        setCartItemsWithDetails(detailedCartItems);
      } catch (error) {
        console.error("Failed to fetch confirmation product details:", error);
      }
    };

    void fetchProductDetails();
  }, [orderDetails]);

  const displayedItems = cartItemsWithDetails.length
    ? cartItemsWithDetails
    : orderDetails?.products || [];

  const customerName = useMemo(() => {
    if (!orderDetails?.userId) return "N/A";
    if (typeof orderDetails.userId === "string") return orderDetails.userId;

    return [
      orderDetails.userId.firstName,
      orderDetails.userId.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "N/A";
  }, [orderDetails?.userId]);

  const pickupPerson = useMemo(() => {
    const pickupDetails = orderDetails?.pickupDetails;
    const pickupName = [pickupDetails?.firstName, pickupDetails?.lastName]
      .filter(Boolean)
      .join(" ");

    return pickupName || customerName;
  }, [orderDetails?.pickupDetails, customerName]);

  const timeText = useMemo(() => {
    if (orderDetails?.deliveryTime) return orderDetails.deliveryTime;
    if (orderDetails?.pickupDetails?.time) return orderDetails.pickupDetails.time;

    if (orderDetails?.deliveryDate) {
      return new Date(orderDetails.deliveryDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return "N/A";
  }, [orderDetails]);

  const dateText = useMemo(() => {
    if (orderDetails?.pickupDetails?.date) {
      return new Date(orderDetails.pickupDetails.date).toLocaleDateString(
        "en-GB"
      );
    }

    if (orderDetails?.deliveryDate) {
      return new Date(orderDetails.deliveryDate).toLocaleDateString("en-GB");
    }

    return "N/A";
  }, [orderDetails]);

  const addressText = useMemo(() => {
    if (orderDetails?.pickupMode !== DELIVERY_MODE_HOME || !shippingAddress) {
      return "N/A";
    }

    return [
      shippingAddress.name && `H.No: ${shippingAddress.name}`,
      shippingAddress.line1,
      shippingAddress.line2,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  }, [orderDetails?.pickupMode, shippingAddress]);

  const handleCompleteOrder = async (success: boolean) => {
    if (!orderDetails?._id) return;

    try {
      setLoading(true);
      const response = await orderService.completeOrderVerification(
        orderDetails._id,
        success
      );

      showAlert(
        success ? "Order Delivered" : "Order Failed",
        response.message ||
          (success
            ? "Order marked as delivered"
            : "Order marked as failed"),
        [
          {
            text: "OK",
            onPress: () => {
              redirectToPage(containers.AdminOrderQRScanScreen);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Failed to complete confirmation order:", error);
      showAlert(
        "Error",
        getErrorMessage(error, "Failed to complete order. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = () => {
    showAlert("Order Verified", "Handed over to customer?", [
      {
        text: "NO",
        style: "cancel",
        onPress: () => {
          void handleCompleteOrder(false);
        },
      },
      {
        text: "YES",
        onPress: () => {
          void handleCompleteOrder(true);
        },
      },
    ]);
  };

  const getImageSource = (item: any) => {
    if (item?.image && typeof item.image === "string" && item.image.trim()) {
      return { uri: item.image };
    }

    if (Array.isArray(item?.image) && item.image.length > 0 && item.image[0]) {
      return { uri: item.image[0] };
    }

    if (typeof item?.image === "number") {
      return item.image;
    }

    if (item?.imageUrl && typeof item.imageUrl === "string" && item.imageUrl.trim()) {
      return { uri: item.imageUrl };
    }

    return placeholderImage;
  };

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="Order Details Confirmation" />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="scan&deliver" />;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isWeb}
      scrollable={false}
      hideNavItems={true}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.contentContainer,
            isWeb && styles.contentContainerWeb,
          ]}
        >
          <View
            style={[
              styles.card,
              isWeb && styles.cardWeb,
              isMobileWeb && styles.cardMobileWeb,
            ]}
          >
            <Text style={styles.title}>Order Details Confirmation</Text>

            {isLoadingOrder ? (
              <Text style={styles.detailLine}>Loading order details...</Text>
            ) : (
              <>
                <View style={styles.detailsBlock}>
                  <Text style={styles.detailLine}>
                    <Text style={styles.detailLabel}>Order ID: </Text>
                    #ORD-{orderDetails?.orderNumber ?? "N/A"}
                  </Text>
                  <Text style={styles.detailLine}>
                    <Text style={styles.detailLabel}>Customer: </Text>
                    {customerName}
                  </Text>
                  <Text style={styles.detailLine}>
                    <Text style={styles.detailLabel}>Who is picking: </Text>
                    {pickupPerson}
                  </Text>
                </View>

                {displayedItems.map((item: any, index: number) => {
                  const price = Number(item?.netPrice ?? 0).toFixed(2);
                  const strikePrice =
                    Number(item?.grossPrice ?? 0) > Number(item?.netPrice ?? 0)
                      ? Number(item.grossPrice).toFixed(2)
                      : null;

                  return (
                    <View
                      key={`${item?._id || item?.productId || item?.name}-${index}`}
                      style={styles.itemCard}
                    >
                      <Image source={getImageSource(item)} style={styles.itemImage} />
                      <View style={styles.itemContent}>
                        <Text style={styles.itemName}>
                          {item?.name || "Unknown Item"}
                        </Text>
                        <Text style={styles.itemMeta}>Qty: {item?.quantity ?? 0}</Text>
                        <View style={styles.itemPriceRow}>
                          <Text style={styles.priceText}>
                            {CurrencySymbol}
                            {price}
                          </Text>
                          {strikePrice ? (
                            <Text style={styles.strikeText}>
                              {CurrencySymbol}
                              {strikePrice}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  );
                })}

                <View style={styles.summaryBlock}>
                  <Text style={styles.summaryLine}>
                    <Text style={styles.summaryLabel}>Total: </Text>
                    {CurrencySymbol}
                    {Number(orderDetails?.totalAmount ?? 0).toFixed(2)}
                  </Text>
                  <Text style={styles.summaryLine}>
                    <Text style={styles.summaryLabel}>Payment: </Text>
                    {String(orderDetails?.paymentStatus || "Done").toUpperCase()}
                  </Text>
                  <Text style={styles.summaryLine}>
                    <Text style={styles.summaryLabel}>Pick Up Choice: </Text>
                    {orderDetails?.pickupMode || "N/A"}
                  </Text>
                  <Text style={styles.summaryLine}>
                    <Text style={styles.summaryLabel}>Time: </Text>
                    {timeText}
                  </Text>
                  <Text style={styles.summaryLine}>
                    <Text style={styles.summaryLabel}>Date: </Text>
                    {dateText}
                  </Text>
                  {orderDetails?.pickupMode === DELIVERY_MODE_HOME ? (
                    <Text style={styles.summaryLine}>
                      <Text style={styles.summaryLabel}>Address: </Text>
                      {addressText}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.buttonSpacing}>
                  <Button
                    title="Confirm Order"
                    onPress={handleConfirmOrder}
                    loading={loading}
                    disabled={loading}
                    style={{ backgroundColor: colors.primary, borderRadius: 14 }}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      {confirmationModal}
    </LayoutComponent>
  );
};

export default AdminOrderConfirmation;
