import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  BackHandler,
} from "react-native";
import styles from "./OrderDetailsStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import CartItem from "../cart/Components/CartItem";
import { router, useLocalSearchParams } from "expo-router";
import RecommendedProductsSlider from "@/app/components/RecommendedProductsSlider";
import products from "@/data/products";
import Footer from "@/app/components/Footer";
import {
  clearNavigationStack,
  redirectToPage,
} from "@/utilities/redirectionHelper";
import containers from "@/containers";
import QRCodeDisplay from "../../components/QRCodeDisplay";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { ProductsAPI } from "@/services/productService";
import colors from "../../../constants/colors";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import {
  ADMIN_ORDER_DETAIL_SCREEN_TITLE,
  DELIVERY_MODE_HOME,
} from "../../../constants/stringLiterals";

const orderDetailsScreen = () => {
  const { from } = useLocalSearchParams();
  const { orderId } = useLocalSearchParams();
  const { orderData } = useLocalSearchParams();

  const [orderDetails, setOrderDetails] = React.useState<any>(null);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);
  const [shippingAddress_order, setShippingAddress_order] =
    React.useState<any>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  // Use refs to prevent unnecessary re-renders and API calls
  const hasLoadedProducts = useRef(false);
  const loadedProductIds = useRef(new Set<string>());
  const isMounted = useRef(true);

  console.log("orderId", orderId);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load order details - runs only once when component mounts
  useEffect(() => {
    let isActive = true;

    const loadOrderDetails = async () => {
      if (!isActive || !isMounted.current) return;

      try {
        setIsLoadingOrder(true);
        let orderData_parsed = null;

        if (orderData && typeof orderData === "string") {
          orderData_parsed = JSON.parse(orderData);
        } else if (orderId) {
          orderData_parsed = await orderService.getOrderById(String(orderId));
        }

        if (isActive && isMounted.current && orderData_parsed) {
          setOrderDetails(orderData_parsed);
          console.log("Order details loaded:", orderData_parsed);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        if (isActive && isMounted.current) {
          setIsLoadingOrder(false);
        }
      }
    };

    loadOrderDetails();

    return () => {
      isActive = false;
    };
  }, [orderId, orderData]); // Only depend on orderId and orderData

  // Memoize the formatted date
  const formattedDate = useMemo(() => {
    if (!orderDetails?.orderDate) return "";
    const rawDate = new Date(orderDetails.orderDate);
    return `${rawDate.getDate().toString().padStart(2, "0")}/${(
      rawDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${rawDate.getFullYear()}`;
  }, [orderDetails?.orderDate]);

  // Fetch shipping address - runs only when shippingAddress ID changes
  useEffect(() => {
    if (!orderDetails?.shippingAddress || isLoadingOrder) return;

    let isActive = true;

    const fetchShippingAddress = async () => {
      if (!isActive || !isMounted.current) return;

      console.log("fetching address", orderDetails.shippingAddress);
      try {
        const response = await addressService.getAddressById(
          orderDetails.shippingAddress
        );

        if (isActive && isMounted.current) {
          console.log("response shipping address", response);
          setShippingAddress_order(response);
        }
      } catch (err) {
        console.error("Failed to fetch shipping address:", err);
      }
    };

    fetchShippingAddress();

    return () => {
      isActive = false;
    };
  }, [orderDetails?.shippingAddress, isLoadingOrder]);

  // Fetch product details - runs only once when order details are loaded
  useEffect(() => {
    if (
      !orderDetails?.products?.length ||
      isLoadingOrder ||
      isLoadingProducts ||
      hasLoadedProducts.current
    ) {
      return;
    }

    let isActive = true;

    const fetchProductDetails = async () => {
      if (!isActive || !isMounted.current) return;

      console.log(
        "Starting to fetch product details for:",
        orderDetails.products.length,
        "products"
      );
      setIsLoadingProducts(true);
      hasLoadedProducts.current = true;

      try {
        const detailedCartItems = await Promise.all(
          orderDetails.products.map(async (item: any) => {
            if (!isActive || !isMounted.current) return item;

            // Skip if already loaded
            if (loadedProductIds.current.has(item.productId.toString())) {
              console.log("Skipping already loaded product:", item.productId);
              return item;
            }

            try {
              console.log("Fetching product details for ID:", item.productId);
              const productDetails = await ProductsAPI.getProductBYID(
                item.productId
              );
              loadedProductIds.current.add(item.productId.toString());

              if (isActive && isMounted.current) {
                return {
                  ...item,
                  image: productDetails.image,
                };
              }
              return item;
            } catch (error) {
              console.error(
                `Failed to fetch product ${item.productId}:`,
                error
              );
              return item;
            }
          })
        );

        if (isActive && isMounted.current) {
          console.log("Setting detailed cart items:", detailedCartItems.length);
          setCartItemsWithDetails(detailedCartItems);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        if (isActive && isMounted.current) {
          setCartItemsWithDetails(orderDetails?.products || []);
        }
      } finally {
        if (isActive && isMounted.current) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchProductDetails();

    return () => {
      isActive = false;
    };
  }, [orderDetails?.products?.length, isLoadingOrder]); // Only depend on products length and loading state

  console.log("orderDetails in orderDetails", orderDetails);
  console.log("shippingAddress_id", orderDetails?.shippingAddress);
  console.log("formattedDate", formattedDate);
  console.log("cartItemsWithDetails", cartItemsWithDetails);

  console.log("orderDetails by order ID", orderDetails);
  // const recommendedProducts = products
  //   .filter((p) =>
  //     ["Greek Yogurt", "Baby Stroller", "Granola Bars"].includes(p.name)
  //   )
  //   .map((product) => ({
  //     id: product.id,
  //     title: product.name,
  //     rating: product.rating,
  //     reviews: product.noOfreviews,
  //     imageUrl: product.image,
  //     discount: product.discount,
  //     netPrice: product.netPrice,
  //   }));

  useEffect(() => {
    const handleHardwareBackPress = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => backHandler.remove();
  }, []);

  // Show loading state
  if (isLoadingOrder || !orderDetails) {
    return (
      <PageLayout
        hasFooter
        hasHeader
        scrollable
        headerComponent={
          <Header
            headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE}
            needResetNavigation={from != "myOrders"}
          />
        }
        footerComponent={<Footer />}
      >
        <View style={styles.container}>
          <Text>Loading order details...</Text>
        </View>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        hasFooter
        hasHeader
        scrollable
        headerComponent={
          <Header
            headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE}
            needResetNavigation={from != "myOrders"}
          />
        }
        footerComponent={<Footer />}
      >
        <View style={styles.container}>
          <View style={[globalStyles.pt_0]}>
            <View style={{}}>
              <QRCodeDisplay
                qrValue={orderDetails.orderNumber?.toString()}
                noteText="*Please present this QR code to our store personnel at the time of pickup. Also, ensure you carry a valid ID proof."
              />
            </View>
            <View style={styles.orderSummaryItem}>
              <Text
                style={[
                  styles.orderSummaryItemText,
                  globalStyles.fontWeight500,
                ]}
              >
                Status
              </Text>
              <Text
                style={[
                  styles.orderSummaryItemText,
                  globalStyles.fontWeight500,
                ]}
              >
                {orderDetails.status}
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Order Number: </Text>
              <Text style={styles.orderSummaryItemText}>
                {orderDetails.orderNumber}
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Date Placed: </Text>
              <Text style={styles.orderSummaryItemText}>{formattedDate}</Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Shipping:</Text>
              <Text style={styles.orderSummaryItemText}>
                £{orderDetails.shippingCharges?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Sub Total:</Text>
              <Text style={styles.orderSummaryItemText}>
                £{orderDetails.totalAmount?.toFixed(2)}
              </Text>
            </View>
            <View>
              {(cartItemsWithDetails.length > 0
                ? cartItemsWithDetails
                : orderDetails.products || []
              ).map((eachProduct: any, index: number) => (
                <CartItem
                  hideActions={true}
                  itemContainerStyle={styles.cartItemContainerStyle}
                  key={`${eachProduct._id}-${eachProduct.productId}-${index}`}
                  cartItem={eachProduct}
                />
              ))}
            </View>
            <View style={[globalStyles.mb_2, styles.deliverSection]}>
              <Text
                style={[
                  globalStyles.fontWeight500,
                  styles.orderSummaryItemText,
                ]}
              >
                Deliver To:
              </Text>
              <TouchableOpacity
                onPress={() => {
                  redirectToPage(containers.deliveryTrackingScreen, {
                    orderId: orderDetails._id,
                  });
                }}
              >
                <Text style={[globalStyles.btnSmUnderLine, { fontSize: 12 }]}>
                  Track Order
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[globalStyles.mb_2, styles.addressText]}>
              Choosen Delivery: {orderDetails.pickupMode}
            </Text>
            {orderDetails.pickupMode === DELIVERY_MODE_HOME &&
              shippingAddress_order && (
                <Text>
                  Address:{" "}
                  {[
                    shippingAddress_order.name,
                    shippingAddress_order.line1,
                    shippingAddress_order.line2,
                    shippingAddress_order.city,
                    shippingAddress_order.state,
                    shippingAddress_order.postalCode?.toString(),
                    shippingAddress_order.phone?.toString(),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}

            {/* <View>
              <RecommendedProductsSlider
                recommendedProducts={recommendedProducts}
                sectionTitleStyle={[
                  styles.orderSummaryItemText,
                  globalStyles.fontWeight500,
                ]}
                title="Would you like to see these too?"
                showAddToCart={false}
              />
            </View> */}
            {/* <View style={styles.buttonContainer}>
               <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    redirectToPage(containers.cancelOrderScreen, {
                      orderDetails: orderDetails,
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Request Cancellation</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => {
                    redirectToPage(containers.returnOrderScreen, {
                      orderDetails: JSON.stringify(orderDetails),
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Request Return</Text>
                </TouchableOpacity> 
            </View> */}
          </View>
        </View>
      </PageLayout>
    </>
  );
};

export default orderDetailsScreen;
