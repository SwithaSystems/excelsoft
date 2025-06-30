import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import styles from "./AdminOrderDetailStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import { utilitiesStyles } from "@/assets/styles/utilitiesStyles";
import Header from "@/components/Header";
import CartItem from "../cartScreen/components/CartItem";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/commonComponents/Button";
import Footer from "@/components/Footer";
import colors from "../config/colors";
import AdminFooter from "@/components/AdminFooter";
import { router, useLocalSearchParams } from "expo-router";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { ProductsAPI } from "@/services/productService";
import PageLayout from "../pageLayoutProps";
import {
  ADMIN_ORDER_DETAIL_SCREEN_TITLE,
  DELIVERY_MODE_HOME,
} from "../config/stringLiterals";
import ModalSelector from "react-native-modal-selector";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { NotificationService } from "@/services/notificationService";
import { showErrorAlert } from "../config/showErrorAlert";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";

const AdminOrderDetail = () => {
  const [status, setStatus] = useState("Pending");
  // const orderStatuses = ["Pending", "Processed", "Delivered", "Cancel"];
  const [allOrderStatuses, setAllOrderStatuses] = useState<string[]>([]);
  const props = useLocalSearchParams();
  const orderId = props.orderId;
  const [orderDetails, setOrderDetails] = useState<any>({});
  const [shippingAddress_order, setShippingAddress_order] =
    React.useState<any>(null);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);
  const [reason, setReason] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [reasonError, setReasonError] = useState("");
  console.log("orderId", orderId);

  const statusesRequiringReason = ["Failed", "Rejected", "Cancelled"];

  const getOrderdetails = async () => {
    const response = await orderService.getOrderByMongoId(String(orderId));
    console.log("response", response);
    setOrderDetails(response);
  };

  const getAllOrderStatuses = async () => {
    const orderStatuses = await orderService.getAllOrderStatuses();
    console.log("all Order statuses", orderStatuses);
    setAllOrderStatuses(orderStatuses?.statuses);
  };
  useEffect(() => {
    getOrderdetails();
  }, []);
  useEffect(() => {
    getAllOrderStatuses();
  }, []);

  console.log("orderDetails in admin", orderDetails);
  const products = orderDetails?.products || [];

  useEffect(() => {
    const fetchShippingAddress = async () => {
      if (!orderDetails?.shippingAddress) return;
      try {
        const response = await addressService.getShippingAddressById(
          orderDetails?.shippingAddress
        );
        console.log("response shipping address", response);
        setShippingAddress_order(response);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };
    fetchShippingAddress();
  }, [orderDetails?.shippingAddress]);

  useEffect(() => {
    if (orderDetails?.status) {
      setStatus(orderDetails.status);
    }
  }, [orderDetails]);

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
    if (statusesRequiringReason.includes(status)) {
      if (!reason || reason.trim().length < 3) {
        if (!reason) {
          showErrorAlert({
            title: "Error",
            message: `Reason is required for this ${status} status`,
          });
        } else {
          showErrorAlert({
            title: "Error",
            message: `Reason should be at least 3 characters long for this ${status} status`,
          });
        }
        return;
      }
    }
    try {
      setIsLoading(true);
      const orderPayload = {
        _id: orderDetails._id,
        status: status,
        reason: reason,
      };
      await orderService.updateOrderStatus(orderPayload);
      await getOrderdetails(); // reload updated order
      Alert.alert("Success", "Order updated successfully.", [
        {
          text: "OK",
          onPress: () =>
            router.replace("/AdminDashboard/AdminDashboard?refresh=true"),
        },
      ]);
      await NotificationService.scheduleLocalNotification(
        "Order Status Update",
        `Your order #ORD-${orderDetails?.orderNumber} is ${status}`,
        { orderId, type: "status_update" }
      );
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update order.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if current status requires a reason
  const shouldShowReasonField = statusesRequiringReason.includes(status);
  useEffect(() => {
    const needsReason = statusesRequiringReason.includes(status);

    if (needsReason) {
      if (reason.trim() === "") {
        setReasonError(`Reason is required for ${status} status`);
      } else if (reason.trim().length < 3) {
        setReasonError("Reason must be at least 3 characters long");
      } else {
        setReasonError("");
      }
    } else {
      setReasonError("");
      setReason("");
    }
  }, [reason, status]);

  return (
    <>
      <PageLayout
        hasHeader
        headerComponent={
          <Header headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE} />
        }
        hasFooter
        footerComponent={<AdminFooter />}
        scrollable
      >
        <KeyBoardWrapper>
          {/* <View style={[globalStyles.pt_0, { flex: 1 }]}> */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {cartItemsWithDetails.map((eachCartItem: any) => {
              console.log("eachCartItem", eachCartItem);
              return (
                <CartItem
                  hideActions={true}
                  itemContainerStyle={{ paddingHorizontal: 0 }}
                  key={eachCartItem._id}
                  cartItem={eachCartItem}
                  showStockStatus={true}
                  stockAvailable={true}
                />
              );
            })}
            <View>
              <Text
                style={[
                  globalStyles.size_16,
                  globalStyles.fontWeight500,
                  globalStyles.mb_1,
                ]}
              >
                Total: {orderDetails?.totalAmount?.toFixed(2)}
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
                <Text
                  style={[globalStyles.size_16, globalStyles.fontWeight500]}
                >
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
                    {new Date(orderDetails.deliveryDate).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
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
              <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                <Text
                  style={[globalStyles.size_16, globalStyles.fontWeight500]}
                ></Text>
                {orderDetails?.pickupMode === DELIVERY_MODE_HOME &&
                  shippingAddress_order && (
                    <Text>
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
              </Text>

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
                onChange={(option) => setStatus(option.value)}
                optionTextStyle={{ color: colors.primary }}
                optionContainerStyle={{ backgroundColor: colors.white }}
                cancelStyle={{ backgroundColor: colors.white }}
                accessible={true}
                accessibilityLabel="Select order status"
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    backgroundColor: "#fff",
                    height: 50,
                    justifyContent: "center",
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#000" }}>{status}</Text>
                </View>
              </ModalSelector>
              {statusesRequiringReason.includes(status) && (
                <>
                  <Text
                    style={[
                      globalStyles.size_16,
                      globalStyles.fontWeight500,
                      globalStyles.mt_2,
                      globalStyles.mb_1,
                    ]}
                  >
                    Reason for {status}:{" "}
                    {reasonError ? (
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
                    ) : null}
                  </Text>

                  <View>
                    <CustomTextInput
                      containerStyle={{
                        ...globalStyles.userInputContainer,
                      }}
                      placeholder="Reason"
                      TextStyle={globalStyles.input}
                      label="Reason"
                      value={reason}
                      setValue={setReason}
                      multiline={true}
                      onPress={() => null}
                    />
                  </View>
                </>
              )}
            </View>
            {/* {shouldShowReasonField && (
              <CustomTextInput
                containerStyle={{
                  ...globalStyles.userInputContainer,
                  marginTop: 20,
                }}
                placeholder="Reason"
                TextStyle={globalStyles.input}
                label="Reason"
                value={reason}
                setValue={setReason}
                multiline={true}
                onPress={() => null}
              />
            )} */}
            <View style={[globalStyles.mt_4, { marginBottom: 40 }]}>
              <Button onPress={handleUpdate} title="Update Details" />
            </View>
          </ScrollView>
          {/* </View> */}
        </KeyBoardWrapper>
      </PageLayout>
    </>
  );
};

export default AdminOrderDetail;
