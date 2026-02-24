import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  Platform,
  useWindowDimensions,
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
  DELIVERY_MODE_HOME,
} from "../../../constants/stringLiterals";
import ModalSelector from "react-native-modal-selector";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { NotificationService } from "@/services/notificationService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";

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
            const productDetails = await ProductsAPI.getProductBYID(
              item.productId
            );
            return {
              ...item,
              image: productDetails.image,
            };
          })
        );
        setCartItemsWithDetails(detailedCartItems);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
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

      if (Platform.OS === "web") {
        window.alert("Order updated successfully!");
        router.replace("/modules/admin/AdminDashboard");
      } else {
        showAlert("Success", "Order updated successfully.", [
          {
            text: "OK",
            onPress: () => router.replace("/modules/admin/AdminDashboard"),
          },
        ]);
      }

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
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter />;

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
          contentContainerStyle={{ paddingBottom: 40 }}
          nestedScrollEnabled
        >
          {cartItemsWithDetails.map((eachCartItem: any) => (
            <CartItem
              hideActions
              itemContainerStyle={{ paddingHorizontal: 0 }}
              key={eachCartItem._id}
              cartItem={eachCartItem}
              showStockStatus
              stockAvailable
            />
          ))}

          <View style={{ minHeight: shouldShowReasonField ? 400 : 200 }}>
            <Text
              style={[
                globalStyles.size_16,
                globalStyles.fontWeight500,
                globalStyles.mb_1,
              ]}
            >
              Total: £ {orderDetails?.totalAmount?.toFixed(2)}
            </Text>
            <Text
              style={[
                globalStyles.size_16,
                globalStyles.fontWeight500,
                globalStyles.mb_1,
              ]}
            >
              Payment: {orderDetails?.paymentStatus}
            </Text>

            <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
              <Text style={[globalStyles.size_16, globalStyles.fontWeight500]}>
                Pick Up Choice:&nbsp;
              </Text>
              {orderDetails?.pickupMode}
            </Text>

            <Text
              style={[
                globalStyles.size_16,
                globalStyles.fontWeight500,
                globalStyles.mb_2,
                { fontWeight: "bold" },
              ]}
            >
              {orderDetails?.pickupMode === DELIVERY_MODE_HOME
                ? "Deliver To:"
                : "Pickup"}
            </Text>

            {orderDetails?.deliveryDate && (
              <>
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                  <Text
                    style={[globalStyles.size_16, globalStyles.fontWeight500]}
                  >
                    Time:
                  </Text>{" "}
                  {new Date(orderDetails.deliveryDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                  <Text
                    style={[globalStyles.size_16, globalStyles.fontWeight500]}
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
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
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
                globalStyles.size_16,
                globalStyles.fontWeight500,
                globalStyles.mt_2,
                globalStyles.mb_1,
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
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        height: 50,
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ fontSize: 16, color: "#000", flex: 1 }}>{status}</Text>
      <Ionicons
        name={isModalOpen ? "chevron-up" : "chevron-down"}
        size={20}
        color={colors.black}
      />
    </View>
  </ModalSelector>
            <View
              style={{
                marginTop: 16,
                opacity: shouldShowReasonField ? 1 : 0,
                height: shouldShowReasonField ? "auto" : 0,
                overflow: "hidden",
              }}
            >
              <Text
                style={[
                  globalStyles.size_16,
                  globalStyles.fontWeight500,
                  globalStyles.mb_1,
                ]}
              >
                Reason for {status}:{" "}
                <Text
                  style={{
                    color: "#ff0000",
                    fontSize: 14,
                    marginTop: 5,
                    marginLeft: 5,
                  }}
                >
                  *
                </Text>
              </Text>

              <CustomTextInput
                containerStyle={{
                  ...globalStyles.userInputContainer,
                }}
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

          <View style={[globalStyles.mt_4, { marginBottom: 40 }]}>
            <Button
              onPress={handleUpdate}
              title="Update Details"
              disabled={isLoading}
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
