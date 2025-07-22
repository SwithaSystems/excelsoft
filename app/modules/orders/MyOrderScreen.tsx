import {
  DATE_FORMAT_Display,
  MY_ORDERS_SCREEN_TITLE,
} from "../../config/stringLiterals";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./MyOrderScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import OrderItem from "./Components/OrderItem";
import Footer from "@/app/components/Footer";
import { orderService } from "@/services/orderService";
import { useLocalSearchParams } from "expo-router";
import PageLayout from "../../pageLayoutProps";
import { format } from "date-fns";

const myOrderScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const params = useLocalSearchParams();

  const userId = params.userId;

  console.log("userId in my orders", userId);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrdersByUserId(userId as string);
      console.log(" all my orders", response);
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={<Header headerText={MY_ORDERS_SCREEN_TITLE} />}
      footerComponent={<Footer />}
    >
      <View style={globalStyles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={[globalStyles.pt_0]}>
                <Text style={styles.yourLastOrders}>Your last orders</Text>

                <FlatList
                  data={orders.map((order) => ({
                    orderId: `#ORD-${order.orderNumber}`,
                    date: order.deliveryDate
                      ? format(
                          new Date(order.deliveryDate),
                          DATE_FORMAT_Display
                        )
                      : "N/A",
                    status: order?.status,
                    totalItems: order.products?.length ?? 0,
                    subtotal: order.totalAmount.toFixed(2),
                    _id: order._id,
                  }))}
                  renderItem={({ item }) => (
                    <OrderItem item={item} from="myOrders" />
                  )}
                  keyExtractor={(item) => item._id}
                  nestedScrollEnabled={true}
                />
              </View>
            </>
          }
          data={[]}
          renderItem={() => null}
        />
      </View>
    </PageLayout>
  );
};

export default myOrderScreen;
