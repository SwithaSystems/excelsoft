import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  Platform,
  Image,
} from "react-native";
import styles from "./AdminOrderDetailStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import CartItem from "../cart/Components/CartItem";
import Button from "@/app/components/commonComponents/Button";
import AdminFooter from "@/app/components/AdminFooter";
import { router, useLocalSearchParams } from "expo-router";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { ProductsAPI } from "@/services/productService";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import {
  ADMIN_ORDER_DETAIL_SCREEN_TITLE,
  DELIVERY_MODE_CURBSIDE,
  DELIVERY_MODE_HOME,
  DELIVERY_MODE_STORE,
} from "../../../constants/stringLiterals";
import ModalSelector from "react-native-modal-selector";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { NotificationService } from "@/services/notificationService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import OrderTimeline from "../delivery/Components/OrderTimeline";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import CurrencySymbol from "@/constants/CurrencySymbol";

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

const AdminOrderDetail = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const [status, setStatus] = useState("Pending");
  const [allOrderStatuses, setAllOrderStatuses] = useState<string[]>([]);
  const [orderDetails, setOrderDetails] = useState<any>({});
  const [shippingAddress_order, setShippingAddress_order] = useState<any>(null);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorModalState, setErrorModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });
  const scrollViewRef = useRef<ScrollView>(null);

  const props = useLocalSearchParams();
  const orderId = props.orderId;

  const statusesRequiringReason = ["Failed", "Rejected", "Cancelled"];
  const showErrorAlert = ({
    title,
    message,
    buttonLabel = "OK",
  }: {
    title: string;
    message: string;
    buttonLabel?: string;
  }) => {
    setErrorModalState({
      isVisible: true,
      title,
      message,
      buttonLabel,
    });
  };

  const getOrderdetails = async () => {
    try {
      const response = await orderService.getOrderByMongoId(String(orderId));
      // console.log("response", response);
      setOrderDetails(response);

      if (response?.status) setStatus(response.status);
      if (response?.reason) setReason(response.reason || "");
    } catch (err) {
      console.error("Failed to get order details:", err);
    }
  };

  const getAllOrderStatuses = async () => {
    try {
      const orderStatuses = await orderService.getAllOrderStatuses();
      // console.log("all Order statuses", orderStatuses);
      setAllOrderStatuses(orderStatuses?.statuses || []);
    } catch (err) {
      console.error("Failed to fetch order statuses:", err);
    }
  };

  useEffect(() => {
    getOrderdetails();
    getAllOrderStatuses();
  }, []);

  useEffect(() => {
    const fetchShippingAddress = async () => {
      if (!orderDetails?.shippingAddress) return;
      try {
        const response = await addressService.getAddressById(
          orderDetails.shippingAddress
        );
        // console.log("response shipping address", response);
        setShippingAddress_order(response);
      } catch (err) {
        console.error("Failed to fetch shipping address:", err);
      }
    };
    fetchShippingAddress();
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
                image: productDetails.image,
              };
            } catch (error) {
              console.error(
                `Failed to fetch product ${item.productId} for order detail:`,
                error
              );
              return item;
            }
          })
        );
        setCartItemsWithDetails(detailedCartItems);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        setCartItemsWithDetails(orderDetails.products || []);
      }
    };
    fetchProductDetails();
  }, [orderDetails]);

  useEffect(() => {
    if (!statusesRequiringReason.includes(status)) {
      setReason("");
    }
  }, [status]);

  const handleUpdate = async () => {
    Keyboard.dismiss();

    // Validation
    if (statusesRequiringReason.includes(status)) {
      if (!reason || reason.trim().length < 3) {
        showErrorAlert({
          title: "Error",
          message: !reason
            ? `Reason is required for ${status} status`
            : `Reason should be at least 3 characters long for ${status} status`,
        });
        return;
      }
    }

    try {
      setIsLoading(true);
      const orderPayload = {
        _id: orderDetails._id,
        status,
        reason,
      };
      await orderService.updateOrderStatus(orderPayload);
      await getOrderdetails();

      showAlert("Success", "Order updated successfully.", [
        {
          text: "OK",
          onPress: () => router.replace("/modules/admin/AdminDashboard"),
        },
      ]);

      if (Platform.OS !== "web") {
        await NotificationService.scheduleLocalNotification(
          "Order Status Update",
          `Your order #ORD-${orderDetails?.orderNumber} is ${status}`,
          { orderId, type: "status_update" }
        );
      }
    } catch (err) {
      console.error("Update failed", err);
      showErrorAlert({
        title: "Error",
        message: "Failed to update order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shouldShowReasonField = statusesRequiringReason.includes(status);

  // const { width } = useWindowDimensions();
  // const isTabOrDesktop = width >= 768;

  const isWeb = Platform.OS === "web";
  const { isMobile: isWebMobile } = useWebMediaQuery();

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

  const getOrderedStatusesForTimeline = (): string[] => {
    if (!orderDetails || !allOrderStatuses.length) return [];

    const hasAgeRestriction = hasAgeRestrictedProducts(orderDetails);
    const currentStatus = orderDetails?.status;

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
      orderDetails?.pickupMode === DELIVERY_MODE_STORE ||
      orderDetails?.pickupMode === DELIVERY_MODE_CURBSIDE ||
      orderDetails?.type === DELIVERY_MODE_CURBSIDE;

    if (isPickupOrder) {
      flow = flow
        .map((statusItem) =>
          statusItem === ORDER_STATUS.DELIVERED
            ? ORDER_STATUS.COLLECTED
            : statusItem
        )
        .filter((statusItem) => statusItem !== ORDER_STATUS.OUT_FOR_DELIVERY);
    }

    if (currentStatus === ORDER_STATUS.STOCK_ISSUE) {
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

    if (negativeStatuses.includes(currentStatus)) {
      const lastUpdatedIndex =
        flow.indexOf(orderDetails.lastValidStatus) >= 0
          ? flow.indexOf(orderDetails.lastValidStatus)
          : flow.indexOf(ORDER_STATUS.PREPARING);

      const truncatedFlow =
        lastUpdatedIndex >= 0 ? flow.slice(0, lastUpdatedIndex + 1) : [];

      return [...truncatedFlow, currentStatus];
    }

    return flow.filter((statusItem) => allOrderStatuses.includes(statusItem));
  };

  const timelineStatuses = getOrderedStatusesForTimeline();
  const deliveryDate = orderDetails?.deliveryDate
    ? new Date(orderDetails.deliveryDate)
    : null;
  const deliveryTimeText = deliveryDate
    ? deliveryDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  const deliveryDateText = deliveryDate
    ? deliveryDate.toLocaleDateString("en-GB")
    : "N/A";
  const addressText =
    orderDetails?.pickupMode === DELIVERY_MODE_HOME && shippingAddress_order
      ? [
          shippingAddress_order.line1,
          shippingAddress_order.line2,
          shippingAddress_order.city,
          shippingAddress_order.state,
          shippingAddress_order.postalCode,
          shippingAddress_order.phone,
        ]
          .filter(Boolean)
          .join(", ")
      : "N/A";
  const getImageSource = (item: any) => {
    const placeholder = require("../../../assets/Placeholder.png");

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

    return placeholder;
  };

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter />;

  if (isWeb) {
    return (
      <LayoutComponent
        hasHeader
        headerComponent={HeaderComponent}
        hasFooter
        footerComponent={FooterComponent}
        hasSidebar={!isWebMobile}
        scrollable
        hideNavItems={true}
      >
        <View style={styles.webPage}>
          <View style={[styles.webShell, isWebMobile && styles.webShellMobile]}>
            <View
              style={[styles.webTopRow, isWebMobile && styles.webTopRowMobile]}
            >
              <View
                style={[
                  styles.webHeroCard,
                  isWebMobile && styles.webHeroCardMobile,
                ]}
              >
                <Text style={styles.webEyebrow}>Order Management</Text>
                <Text
                  style={[styles.webTitle, isWebMobile && styles.webTitleMobile]}
                >
                  #{orderDetails?.orderNumber || "N/A"}
                </Text>
                <Text
                  style={[
                    styles.webSubtitle,
                    isWebMobile && styles.webSubtitleMobile,
                  ]}
                >
                  Review line items, inspect delivery details, track progress,
                  and update the order status from one place.
                </Text>

                <View
                  style={[
                    styles.webSummaryGrid,
                    isWebMobile && styles.webSummaryGridMobile,
                  ]}
                >
                  <View
                    style={[
                      styles.webSummaryTile,
                      isWebMobile && styles.webSummaryTileMobile,
                    ]}
                  >
                    <Text style={styles.webSummaryLabel}>Customer</Text>
                    <Text
                      style={[
                        styles.webSummaryValue,
                        isWebMobile && styles.webSummaryValueMobile,
                      ]}
                    >
                      {orderDetails?.userId?.firstName || "N/A"}{" "}
                      {orderDetails?.userId?.lastName || ""}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.webSummaryTile,
                      isWebMobile && styles.webSummaryTileMobile,
                    ]}
                  >
                    <Text style={styles.webSummaryLabel}>Current Status</Text>
                    <Text
                      style={[
                        styles.webSummaryValue,
                        isWebMobile && styles.webSummaryValueMobile,
                      ]}
                    >
                      {status}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.webSummaryTile,
                      isWebMobile && styles.webSummaryTileMobile,
                    ]}
                  >
                    <Text style={styles.webSummaryLabel}>Payment</Text>
                    <Text
                      style={[
                        styles.webSummaryValue,
                        isWebMobile && styles.webSummaryValueMobile,
                      ]}
                    >
                      {orderDetails?.paymentStatus || "N/A"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.webSummaryTile,
                      isWebMobile && styles.webSummaryTileMobile,
                    ]}
                  >
                    <Text style={styles.webSummaryLabel}>Total</Text>
                    <Text
                      style={[
                        styles.webSummaryValue,
                        isWebMobile && styles.webSummaryValueMobile,
                      ]}
                    >
                      {CurrencySymbol}
                      {orderDetails?.totalAmount?.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.webDetailsCard,
                  isWebMobile && styles.webDetailsCardMobile,
                ]}
              >
                <Text style={styles.webCardTitle}>Delivery Snapshot</Text>
                <View style={styles.webDetailRow}>
                  <Text style={styles.webDetailLabel}>Fulfilment</Text>
                  <Text style={styles.webDetailValue}>
                    {orderDetails?.pickupMode || "N/A"}
                  </Text>
                </View>
                <View style={styles.webDetailRow}>
                  <Text style={styles.webDetailLabel}>Time</Text>
                  <Text style={styles.webDetailValue}>{deliveryTimeText}</Text>
                </View>
                <View style={styles.webDetailRow}>
                  <Text style={styles.webDetailLabel}>Date</Text>
                  <Text style={styles.webDetailValue}>{deliveryDateText}</Text>
                </View>
                <View style={styles.webAddressBlock}>
                  <Text style={styles.webDetailLabel}>
                    {orderDetails?.pickupMode === DELIVERY_MODE_HOME
                      ? "Delivery Address"
                      : "Pickup Notes"}
                  </Text>
                  <Text style={styles.webAddressValue}>
                    {orderDetails?.pickupMode === DELIVERY_MODE_HOME
                      ? addressText
                      : orderDetails?.pickupDetails?.additionalDetails || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.webMainGrid,
                isWebMobile && styles.webMainGridMobile,
              ]}
            >
              <View
                style={[
                  styles.webProductsCard,
                  isWebMobile && styles.webProductsCardMobile,
                ]}
              >
                <View style={styles.webSectionHeader}>
                  <Text style={styles.webCardTitle}>Order Items</Text>
                  <Text style={styles.webSectionMeta}>
                    {cartItemsWithDetails.length || orderDetails?.products?.length || 0} items
                  </Text>
                </View>

                {isWebMobile
                  ? (cartItemsWithDetails.length
                      ? cartItemsWithDetails
                      : orderDetails?.products || []
                    ).map((eachCartItem: any, index: number) => (
                      <View
                        key={`${eachCartItem._id || eachCartItem.productId}-${index}`}
                        style={styles.webMobileItemCard}
                      >
                        <View style={styles.webMobileItemImageWrap}>
                          <Image
                            source={getImageSource(eachCartItem)}
                            style={styles.webMobileItemImage}
                          />
                        </View>
                        <View style={styles.webMobileItemContent}>
                          <Text
                            style={styles.webMobileItemName}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {eachCartItem.name || "Unknown Item"}
                          </Text>
                          <Text style={styles.webMobileItemMeta}>
                            Qty: {eachCartItem.quantity}
                          </Text>
                          <Text style={styles.webMobileItemPrice}>
                            {CurrencySymbol}
                            {Number(eachCartItem.netPrice || 0).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ))
                  : (cartItemsWithDetails.length
                      ? cartItemsWithDetails
                      : orderDetails?.products || []
                    ).map((eachCartItem: any, index: number) => (
                      <CartItem
                        hideActions
                        itemContainerStyle={styles.webCartItem}
                        key={`${eachCartItem._id || eachCartItem.productId}-${index}`}
                        cartItem={eachCartItem}
                        showStockStatus
                        stockAvailable
                      />
                    ))}
              </View>

              <View
                style={[
                  styles.webSideColumn,
                  isWebMobile && styles.webSideColumnMobile,
                ]}
              >
                <View
                  style={[
                    styles.webTimelineCard,
                    isWebMobile && styles.webTimelineCardMobile,
                  ]}
                >
                  <Text style={styles.webCardTitle}>Order Timeline</Text>
                  <Text style={styles.webTimelineSubtitle}>
                    Live progress for this order is shown below.
                  </Text>
                  <View
                    style={[
                      styles.webTimelineWrap,
                      isWebMobile && styles.webTimelineWrapMobile,
                    ]}
                  >
                    <OrderTimeline
                      statusList={timelineStatuses}
                      actualStatus={orderDetails?.status}
                      reason={orderDetails?.reason}
                      pickupMode={orderDetails?.pickupMode}
                      compact
                      horizontal={!isWebMobile}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.webStatusCard,
                    isWebMobile && styles.webStatusCardMobile,
                  ]}
                >
                  <Text style={styles.webCardTitle}>Update Status</Text>
                  <Text style={styles.webStatusHelp}>
                    Select the next status and add a reason when required.
                  </Text>

                  <Text style={styles.webFieldLabel}>Status</Text>
                  <ModalSelector
                    data={allOrderStatuses.map((item, index) => ({
                      key: index,
                      label: item,
                      value: item,
                    }))}
                    initValue=""
                    onChange={(option) => {
                      setStatus(option.value);
                      setIsModalOpen(false);
                    }}
                    onModalOpen={() => setIsModalOpen(true)}
                    onModalClose={() => setIsModalOpen(false)}
                    optionTextStyle={{ color: colors.primary }}
                    optionContainerStyle={{ backgroundColor: colors.white }}
                    cancelStyle={{ backgroundColor: colors.white }}
                    accessible
                    accessibilityLabel="Select order status"
                  >
                    <View style={styles.webDropdown}>
                      <Text style={styles.webDropdownText}>{status}</Text>
                      <Ionicons
                        name={isModalOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.black}
                      />
                    </View>
                  </ModalSelector>

                  {shouldShowReasonField && (
                    <View style={styles.webReasonWrap}>
                      <Text style={styles.webFieldLabel}>
                        Reason for {status}
                      </Text>
                      <CustomTextInput
                        containerStyle={styles.webReasonInput}
                        placeholder="Provide context for this status update"
                        TextStyle={globalStyles.input}
                        label="Reason"
                        value={reason}
                        setValue={setReason}
                        multiline
                        onPress={() => null}
                      />
                    </View>
                  )}

                  <View style={styles.webButtonRow}>
                    <Button
                      onPress={handleUpdate}
                      title="Update Details"
                      disabled={isLoading}
                      loading={isLoading}
                      style={styles.webPrimaryButton}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <ConfirmationModal
          isModalVisible={errorModalState.isVisible}
          onClose={() =>
            setErrorModalState((prev) => ({ ...prev, isVisible: false }))
          }
          title={errorModalState.title}
          text={errorModalState.message}
          submitText={errorModalState.buttonLabel}
          handleSubmit={() =>
            setErrorModalState((prev) => ({ ...prev, isVisible: false }))
          }
        />
        {confirmationModal}
      </LayoutComponent>
    );
  }

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
      <KeyBoardWrapper>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.mobileContent}
          nestedScrollEnabled
        >
          {(cartItemsWithDetails.length
            ? cartItemsWithDetails
            : orderDetails?.products || []
          ).map((eachCartItem: any, index: number) => (
            <CartItem
              hideActions
              itemContainerStyle={styles.mobileCartItem}
              key={`${eachCartItem._id || eachCartItem.productId}-${index}`}
              cartItem={eachCartItem}
              showStockStatus
              stockAvailable
            />
          ))}

          <View style={styles.mobileSectionCard}>
            <Text
              style={[
                styles.mobileSectionTitle,
                { marginBottom: 12 },
              ]}
            >
              Order Summary
            </Text>
            <Text
              style={[
                styles.mobileValueText,
                globalStyles.fontWeight500,
                globalStyles.mb_1,
              ]}
            >
              Total: £ {orderDetails?.totalAmount?.toFixed(2)}
            </Text>
            <Text
              style={[
                styles.mobileValueText,
                globalStyles.fontWeight500,
                globalStyles.mb_1,
              ]}
            >
              Payment: {orderDetails?.paymentStatus}
            </Text>

            <Text style={[styles.mobileValueText, globalStyles.mb_1]}>
              <Text style={[styles.mobileValueText, globalStyles.fontWeight500]}>
                Pick Up Choice:&nbsp;
              </Text>
              {orderDetails?.pickupMode}
            </Text>

            <Text
              style={[
                styles.mobileSectionTitle,
              ]}
            >
              {orderDetails?.pickupMode === DELIVERY_MODE_HOME
                ? "Deliver To:"
                : "Pickup"}
            </Text>

            {orderDetails?.deliveryDate && (
              <>
                <Text style={[styles.mobileValueText, globalStyles.mb_1]}>
                  <Text
                    style={[styles.mobileValueText, globalStyles.fontWeight500]}
                  >
                    Time:
                  </Text>{" "}
                  {new Date(orderDetails.deliveryDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={[styles.mobileValueText, globalStyles.mb_1]}>
                  <Text
                    style={[styles.mobileValueText, globalStyles.fontWeight500]}
                  >
                    Date:
                  </Text>{" "}
                  {new Date(orderDetails.deliveryDate).toLocaleDateString(
                    "en-GB"
                  )}
                </Text>
              </>
            )}

            {orderDetails?.pickupMode === DELIVERY_MODE_HOME &&
              shippingAddress_order && (
                <Text style={[styles.mobileValueText, globalStyles.mb_1]}>
                  Address:{" "}
                  {[
                    shippingAddress_order.line1,
                    shippingAddress_order.line2,
                    shippingAddress_order.city,
                    shippingAddress_order.state,
                    shippingAddress_order.postalCode,
                    shippingAddress_order.phone,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}

            <Text
              style={[
                styles.mobileFieldLabel,
                globalStyles.mt_2,
              ]}
            >
              Status:
            </Text>

            <ModalSelector
              data={allOrderStatuses.map((item, index) => ({
                key: index,
                label: item,
                value: item,
              }))}
              initValue=""
              onChange={(option) => {
                setStatus(option.value);
                setIsModalOpen(false);
              }}
              onModalOpen={() => setIsModalOpen(true)}
              onModalClose={() => setIsModalOpen(false)}
              optionTextStyle={{ color: colors.primary }}
              optionContainerStyle={{ backgroundColor: colors.white }}
              cancelStyle={{ backgroundColor: colors.white }}
              accessible
              accessibilityLabel="Select order status"
            >
              <View style={styles.mobileDropdown}>
                <Text style={styles.mobileDropdownText}>
                  {status}
                </Text>
                <Ionicons
                  name={isModalOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.black}
                />
              </View>
            </ModalSelector>
            <View
              style={[
                styles.mobileReasonWrap,
                {
                  opacity: shouldShowReasonField ? 1 : 0,
                  height: shouldShowReasonField ? "auto" : 0,
                  overflow: "hidden",
                },
              ]}
            >
              <Text
                style={[
                  styles.mobileValueText,
                  globalStyles.fontWeight500,
                  globalStyles.mb_1,
                ]}
              >
                Reason for {status}:{" "}
                <Text style={styles.mobileReasonRequired}>
                  *
                </Text>
              </Text>

              <CustomTextInput
                containerStyle={styles.mobileReasonInput}
                placeholder="Reason"
                TextStyle={globalStyles.input}
                label="Reason"
                value={reason}
                setValue={setReason}
                multiline
                onPress={() => null}
              />
            </View>
          </View>

          <View style={styles.mobileButtonWrap}>
            <Button
              onPress={handleUpdate}
              title="Update Details"
              disabled={isLoading}
              loading={isLoading}
              style={styles.mobileButton}
            />
          </View>
        </ScrollView>
      </KeyBoardWrapper>
      <ConfirmationModal
        isModalVisible={errorModalState.isVisible}
        onClose={() =>
          setErrorModalState((prev) => ({ ...prev, isVisible: false }))
        }
        title={errorModalState.title}
        text={errorModalState.message}
        submitText={errorModalState.buttonLabel}
        handleSubmit={() =>
          setErrorModalState((prev) => ({ ...prev, isVisible: false }))
        }
      />
      {confirmationModal}
    </LayoutComponent>
  );
};

export default AdminOrderDetail;
