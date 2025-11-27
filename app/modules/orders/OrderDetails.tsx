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
  useWindowDimensions,
} from "react-native";
import styles from "./OrderDetailsStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import CartItem from "../cart/Components/CartItem";
import { router, useLocalSearchParams } from "expo-router";
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
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import {
  ADMIN_ORDER_DETAIL_SCREEN_TITLE,
  DELIVERY_MODE_HOME,
} from "../../../constants/stringLiterals";
import OrderTimeline from "../delivery/Components/OrderTimeline";

const orderDetailsScreen = () => {
  const { from } = useLocalSearchParams();
  const { orderId } = useLocalSearchParams();
  const { orderData } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const [orderDetails, setOrderDetails] = React.useState<any>(null);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);
  const [shippingAddress_order, setShippingAddress_order] =
    React.useState<any>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [allOrderStatuses, setAllOrderStatuses] = useState<string[]>([]);

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

  // Load all order statuses
  useEffect(() => {
    let isActive = true;

    const getAllOrderStatuses = async () => {
      if (!isActive || !isMounted.current) return;
      try {
        const orderStatuses = await orderService.getAllOrderStatuses();
        if (isActive && isMounted.current) {
          setAllOrderStatuses(orderStatuses?.statuses || []);
        }
      } catch (err) {
        console.error("Failed to load order statuses:", err);
      }
    };

    getAllOrderStatuses();

    return () => {
      isActive = false;
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

        if (orderData) {
          try {
            orderData_parsed =
              typeof orderData === "string"
                ? JSON.parse(orderData)
                : orderData;
          } catch (parseError) {
            console.error("Failed to parse orderData param:", parseError);
            orderData_parsed = null;
          }
        }

        if (!orderData_parsed && orderId) {
          // Some flows send the Mongo _id instead of the public orderNumber.
          try {
            orderData_parsed = await orderService.getOrderByMongoId(
              String(orderId)
            );
          } catch (mongoErr) {
            console.warn(
              "getOrderByMongoId failed, falling back to getOrderById",
              mongoErr
            );
            orderData_parsed = await orderService.getOrderById(
              String(orderId)
            );
          }
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

  // Function to get ordered statuses for timeline
  const getOrderedStatusesForTimeline = (): string[] => {
    if (!orderDetails || !allOrderStatuses.length) return [];

    const ORDER_STATUS = {
      ORDER_PLACED: "Order Placed",
      AWAITING_AGE_VERIFICATION: "Awaiting Age Verification",
      PREPARING: "Preparing",
      READY: "Ready",
      OUT_FOR_DELIVERY: "Out for Delivery",
      DELIVERED: "Delivered",
      COLLECTED: "Collected",
      CANCELLED: "Cancelled",
      FAILED: "Failed",
      REJECTED: "Rejected",
      STOCK_ISSUE: "Stock Issue",
    } as const;

    const hasAgeRestrictedProducts = (order: any): boolean => {
      if (!order?.items && !order?.products) return false;
      const items = order.items || order.products || [];
      return items.some(
        (item: any) =>
          item.isAgeRestricted ||
          item.ageRestricted ||
          item.requiresAgeVerification ||
          item.product?.isAgeRestricted ||
          item.product?.ageRestricted
      );
    };

    const hasAgeRestriction = hasAgeRestrictedProducts(orderDetails);
    const status = orderDetails?.status;

    let flow: string[] = hasAgeRestriction
      ? [
          ORDER_STATUS.ORDER_PLACED,
          ORDER_STATUS.AWAITING_AGE_VERIFICATION,
          ORDER_STATUS.PREPARING,
          ORDER_STATUS.READY,
          ORDER_STATUS.OUT_FOR_DELIVERY,
          ORDER_STATUS.DELIVERED,
        ]
      : [
          ORDER_STATUS.ORDER_PLACED,
          ORDER_STATUS.PREPARING,
          ORDER_STATUS.READY,
          ORDER_STATUS.OUT_FOR_DELIVERY,
          ORDER_STATUS.DELIVERED,
        ];

    const isPickupOrder =
      orderDetails?.pickupMode === "Store Pickup" ||
      orderDetails?.type === "Curbside";

    if (isPickupOrder) {
      flow = flow
        .map((status: any) =>
          status === ORDER_STATUS.DELIVERED ? ORDER_STATUS.COLLECTED : status
        )
        .filter((status: any) => status !== ORDER_STATUS.OUT_FOR_DELIVERY);
    }

    if (status === ORDER_STATUS.STOCK_ISSUE) {
      const prepIndex = flow.indexOf(ORDER_STATUS.PREPARING);
      if (prepIndex !== -1) {
        flow = flow.slice(0, prepIndex + 1);
        flow.push(ORDER_STATUS.STOCK_ISSUE);
      }
      return flow;
    }

    const negativeStatuses = [
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.FAILED,
      ORDER_STATUS.REJECTED,
    ];

    if (negativeStatuses.includes(status)) {
      const lastUpdatedIndex =
        flow.indexOf(orderDetails.lastValidStatus) >= 0
          ? flow.indexOf(orderDetails.lastValidStatus)
          : flow.indexOf(ORDER_STATUS.PREPARING);

      const truncatedFlow =
        lastUpdatedIndex >= 0 ? flow.slice(0, lastUpdatedIndex + 1) : [];

      return [...truncatedFlow, status];
    }

    return flow.filter((status: any) => allOrderStatuses.includes(status));
  };

  const displayStatuses = getOrderedStatusesForTimeline();


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
    const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
    const HeaderComponent = isTabOrDesktop ? (
      <BrandHeaderWeb />
    ) : (
      <Header
        headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE}
        needResetNavigation={from != "myOrders"}
      />
    );
    const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <Footer />;

    return (
      <LayoutComponent
        hasFooter
        hasHeader
        scrollable
        headerComponent={HeaderComponent}
        footerComponent={FooterComponent}
      >
        <View style={styles.container}>
          <Text>Loading order details...</Text>
        </View>
      </LayoutComponent>
    );
  }

  // Web layout matching the design
  if (isTabOrDesktop) {
    const HeaderComponent = <BrandHeaderWeb />;
    const FooterComponent = <FooterWeb />;
    
    return (
      <>
        <PageLayoutWeb
          hasFooter
          hasHeader
          scrollable
          headerComponent={HeaderComponent}
          footerComponent={FooterComponent}
        >
          <View style={styles.container}>
            <View style={[globalStyles.pt_0, styles.webContentWrapper]}>
              <View style={styles.webHeaderRow}>
                <Text style={styles.webPageTitle}>Order Details</Text>
              </View>
              {/* Top Section: QR Code and Order Summary */}
              <View style={styles.webTopSection}>
                {/* Left: QR Code */}
                <View style={styles.webQrCard}>
                  <View style={styles.webQrContent}>
                    <View style={styles.webQrContainer}>
                      <QRCodeDisplay
                        qrValue={orderDetails.orderNumber?.toString()}
                        size={isTabOrDesktop ? 165 : 200}
                        hideNumber={true}
                      />
                    </View>
                    <View style={styles.webQrTextWrapper}>
                      <Text style={styles.webQrTitle}>
                        QR Number:{" "}
                        <Text style={styles.webQrHighlight}>
                          {orderDetails.orderNumber?.toString()}
                        </Text>
                      </Text>
                      <Text style={styles.webQrDescription}>
                        Show this QR code to our store personnel during the
                        pickup.
                      </Text>
                      <Text style={styles.webQrInstruction}>
                        Please carry a valid ID proof for verification.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right: Order Summary */}
                <View style={styles.webStatusCard}>
                  {[
                    {
                      label: "Status",
                      value: orderDetails.status,
                      bold: true,
                    },
                    {
                      label: "Order Number",
                      value: orderDetails.orderNumber,
                    },
                    { label: "Date Placed", value: formattedDate },
                    {
                      label: "Shipping",
                      value: `£${orderDetails.shippingCharges?.toFixed(2)}`,
                    },
                    {
                      label: "Sub Total",
                      value: `£${orderDetails.totalAmount?.toFixed(2)}`,
                    },
                  ].map((row) => (
                    <View style={styles.orderSummaryItemWeb} key={row.label}>
                      <Text
                        style={[
                          styles.orderSummaryItemTextWeb,
                          row.bold && globalStyles.fontWeight500,
                        ]}
                      >
                        {row.label}
                      </Text>
                      <Text
                        style={[
                          styles.orderSummaryItemTextWeb,
                          row.bold && globalStyles.fontWeight500,
                        ]}
                      >
                        {row.value}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.webDeliverToSection}>
                    <Text
                      style={[
                        globalStyles.fontWeight500,
                        styles.orderSummaryItemTextWeb,
                      ]}
                    >
                      Deliver To:
                    </Text>
                    <Text style={styles.orderSummaryItemTextWeb}>
                      Choosen Delivery:{" "}
                      {orderDetails.pickupMode === DELIVERY_MODE_HOME
                        ? "Home Delivery"
                        : orderDetails.pickupMode}
                    </Text>
                    {orderDetails.pickupMode === DELIVERY_MODE_HOME &&
                      shippingAddress_order && (
                        <Text style={styles.orderSummaryItemTextWeb}>
                          Address:{" "}
                          {[
                            shippingAddress_order.name &&
                              `H.No: ${shippingAddress_order.name}`,
                            shippingAddress_order.line1,
                            shippingAddress_order.line2,
                            shippingAddress_order.city,
                            shippingAddress_order.state,
                            shippingAddress_order.postalCode?.toString(),
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>
                      )}
                  </View>
                </View>
              </View>

              {/* Middle Section: Ordered Items and Tracking Timeline */}
              <View style={styles.webMiddleSection}>
                {/* Left: Ordered Items */}
                <View style={styles.webOrderItemsCard}>
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

                {/* Right: Order Tracking Timeline */}
                <View style={styles.webTimelineCard}>
                  <Text style={styles.webTimelineTitle}>
                    Track Your Order here:
                  </Text>
                  <Text style={styles.webTimelineSubtitle}>
                    Your Order packed Successfully!! Let's see the Progress!
                  </Text>
                  <ScrollView 
                    style={styles.webTimelineContainer}
                    contentContainerStyle={styles.webTimelineContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <OrderTimeline
                      statusList={displayStatuses}
                      actualStatus={orderDetails?.status}
                      reason={orderDetails?.reason}
                      compact={true}
                    />
                  </ScrollView>
                </View>
              </View>

            </View>
          </View>
        </PageLayoutWeb>
      </>
    );
  }

  // Mobile layout (unchanged)
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
          </View>
        </View>
      </PageLayout>
    </>
  );
};

export default orderDetailsScreen;
