import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
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
import { useLocalSearchParams } from "expo-router";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { ProductsAPI } from "@/services/productService";
import PageLayout from "../pageLayoutProps";
import { ADMIN_ORDER_DETAIL_SCREEN_TITLE } from "../config/stringLiterals";
import ModalSelector from "react-native-modal-selector";

const AdminOrderDetail = () => {
  const [status, setStatus] = useState("Pending");
  const orderStatuses = ["Pending", "Processed", "Delivered", "Cancel"];
  const props = useLocalSearchParams();
  const orderId = props.orderId;
  const [orderDetails, setOrderDetails] = useState<any>({});
  const [shippingAddress_order, setShippingAddress_order] =
    React.useState<any>(null);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);
  console.log("orderId", orderId);

  const getOrderdetails = async () => {
    const response = await orderService.getOrderByMongoId(String(orderId));
    console.log("response", response);
    setOrderDetails(response);
  };

  useEffect(() => {
    getOrderdetails();
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
  // const cartItems = [
  //   {
  //     id: 1,
  //     image: require("assets/DuckToys.png"),
  //     name: "Duck Toys",
  //     price: 10.0,
  //     originalPrice: 6.99,
  //     quantity: 1,
  //   },
  //   {
  //     id: 2,
  //     image: require("../../assets/OrangeJuice.png"),
  //     name: "Orange Juice",
  //     price: 3.0,
  //     quantity: 2,
  //   },
  //   {
  //     id: 3,
  //     image: require("../../assets/baby-bicycle.png"),
  //     name: "Whole Wheat Bread",
  //     price: 12.0,
  //     quantity: 1,
  //   },
  // ];

  return (
    <>
      {/* <SafeAreaView style={globalStyles.safeAreaContainer}>
        <View style={[globalStyles.container, { flex: 1 }]}>
          <Header headerText="Order Details" /> */}
      <PageLayout
        hasHeader
        headerComponent={
          <Header headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE} />
        }
        hasFooter
        footerComponent={<AdminFooter />}
        scrollable
      >
        {/* <SafeAreaView style={{ flex: 1 }}> */}
        <View
          style={[
            // globalStyles.sectionContent,
            globalStyles.pt_0,
            { flex: 1 },
          ]}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ paddingBottom: 100 }}
          >
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
              <Text
                style={[
                  globalStyles.size_16,
                  globalStyles.fontWeight500,
                  globalStyles.mb_2,
                ]}
              >
                Deliver To:
              </Text>
              <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                <Text
                  style={[globalStyles.size_16, globalStyles.fontWeight500]}
                >
                  Pick Up Choice:&nbsp;
                </Text>
                Home Delivery
              </Text>
              <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                <Text
                  style={[globalStyles.size_16, globalStyles.fontWeight500]}
                >
                  Time:&nbsp;
                </Text>
                8 am to 9 am
              </Text>
              <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                <Text
                  style={[globalStyles.size_16, globalStyles.fontWeight500]}
                >
                  Date:&nbsp;
                </Text>
                03-02-2025
              </Text>
              <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                <Text
                  style={[globalStyles.size_16, globalStyles.fontWeight500]}
                >
                  Address:&nbsp;
                </Text>
                {orderDetails?.pickupMode === "homeDelivery" && (
                  <Text style={[globalStyles.mb_3, styles.addressText]}>
                    {shippingAddress_order?.line1}
                    {shippingAddress_order?.city},{" "}
                    {shippingAddress_order?.state}
                    {shippingAddress_order?.postalCode},{" "}
                  </Text>
                )}
              </Text>

              {/* FIXED: Status section - simple approach */}
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
                data={orderStatuses.map((item, index) => ({
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

              {/* <Picker
                  selectedValue={status}
                  style={{
                    height: 50,
                  }}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                >
                  {orderStatuses.map((each, index) => {
                    return (
                      <Picker.Item key={index} label={each} value={each} />
                    );
                  })}
                </Picker> */}
            </View>
            <View style={[globalStyles.mt_4, { marginBottom: 40 }]}>
              <Button onPress={() => {}} title="Update Details" />
            </View>
          </ScrollView>
        </View>
        a {/* </SafeAreaView> */}
        {/* </View>
        <AdminFooter />
      </SafeAreaView> */}
      </PageLayout>
    </>
  );
};

export default AdminOrderDetail;
