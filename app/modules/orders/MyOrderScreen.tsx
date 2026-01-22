import {
  DATE_FORMAT_Display,
  MY_ORDERS_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./MyOrderScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import OrderItem from "./Components/OrderItem";
import Footer from "@/app/components/Footer";
import { orderService } from "@/services/orderService";
import { useLocalSearchParams } from "expo-router";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { format } from "date-fns";
import { Platform } from "react-native";
import { ProductsAPI } from "@/services/productService";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";

const myOrderScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersWithProducts, setOrdersWithProducts] = useState<any[]>([]);
  const params = useLocalSearchParams();
  const isWeb = Platform.OS === "web";

  const userId = params.userId;

  // console.log("userId in my orders", userId);

  const fetchOrders = async () => {
    try {
      // console.log("[MyOrderScreen] Fetching orders for userId:", userId);
      if (!userId) {
        console.error("[MyOrderScreen] ERROR: userId is missing!");
        return;
      }
      const response = await orderService.getOrdersByUserId(userId as string);
      // console.log("[MyOrderScreen] Orders fetched:", response?.length || 0, "orders");
      // console.log("[MyOrderScreen] Orders data:", response);
      setOrders(response || []);
      
      // Fetch product images for web view - optimized with batch fetching
      if (isWeb && response.length > 0) {
        // Collect all unique product IDs from all orders to avoid duplicate fetches
        const allProductIds = new Set<number>();
        response.forEach((order: any) => {
          if (order.products && order.products.length > 0) {
            order.products.forEach((product: any) => {
              if (product.productId) {
                allProductIds.add(product.productId);
              }
            });
          }
        });

        // Fetch all unique products in parallel batches
        const productIdsArray = Array.from(allProductIds);
        const batchSize = 10; // Process 10 products at a time to avoid overwhelming
        const productMap = new Map<number, any>();

        // Process in batches for better performance
        for (let i = 0; i < productIdsArray.length; i += batchSize) {
          const batch = productIdsArray.slice(i, i + batchSize);
          try {
            // Fetch products in parallel for this batch
            const batchPromises = batch.map((productId) =>
              ProductsAPI.getProductBYID(productId)
                .then((product) => ({ productId, product }))
                .catch((error) => {
                  console.error(`Failed to fetch product ${productId}:`, error);
                  return null;
                })
            );
            
            const batchResults = await Promise.all(batchPromises);
            batchResults.forEach((result) => {
              if (result) {
                productMap.set(result.productId, result.product);
              }
            });
          } catch (error) {
            console.error("Error fetching product batch:", error);
          }
        }

        // Map products to orders using the cached product map
        const ordersWithProductImages = response.map((order: any) => {
          if (!order.products || order.products.length === 0) {
            return { ...order, productsWithImages: [] };
          }

          const productsWithImages = order.products.map((product: any) => {
            const productDetails = productMap.get(product.productId);
            if (productDetails) {
              return {
                ...product,
                image: productDetails.image,
              };
            }
            // Return product without image if fetch failed
            return product;
          });

          return { ...order, productsWithImages };
        });

        setOrdersWithProducts(ordersWithProductImages);
      }
    } catch (error: any) {
      console.error("[MyOrderScreen] Error fetching orders:", error);
      console.error("[MyOrderScreen] Error details:", {
        message: error?.message,
        stack: error?.stack,
        userId: userId
      });
      setOrders([]); // Set empty array on error to prevent undefined state
    }
  };

  useEffect(() => {
    // console.log("[MyOrderScreen] Component mounted, userId:", userId);
    if (userId) {
      fetchOrders();
    } else {
      console.warn("[MyOrderScreen] WARNING: No userId provided, cannot fetch orders");
    }
  }, [userId]);

  const HeaderComponent = isWeb ? <BrandHeaderWeb /> : <Header headerText={MY_ORDERS_SCREEN_TITLE} />;
  const FooterComponent = isWeb ? <FooterWeb /> : <Footer />;
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  // Log render state
  // console.log("[MyOrderScreen] Rendering with orders:", orders.length, "ordersWithProducts:", ordersWithProducts.length, "isWeb:", isWeb);

  return (
    <LayoutComponent
      hasFooter
      hasHeader
      scrollable
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      hasSidebar={isWeb}
      userSidebar={true}
    >
      <View style={globalStyles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={[globalStyles.pt_0]}>
                {orders.length === 0 && (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#666' }}>No orders found</Text>
                  </View>
                )}
                <FlatList
                  data={isWeb && ordersWithProducts.length > 0 
                    ? ordersWithProducts.map((order) => ({
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
                        deliveryDate: order.deliveryDate,
                        products: order.productsWithImages || order.products || [],
                        fullOrder: order,
                      }))
                    : orders.map((order) => ({
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
                        deliveryDate: order.deliveryDate,
                        products: order.products || [],
                        fullOrder: order,
                      }))}
                  renderItem={({ item }) => (
                    <OrderItem item={item} from="myOrders" isTabOrDesktop={isWeb} />
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
    </LayoutComponent>
  );
};

export default myOrderScreen;
