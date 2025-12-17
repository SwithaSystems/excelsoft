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
import { useWindowDimensions } from "react-native";
import { ProductsAPI } from "@/services/productService";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";

const myOrderScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersWithProducts, setOrdersWithProducts] = useState<any[]>([]);
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const userId = params.userId;

  // console.log("userId in my orders", userId);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrdersByUserId(userId as string);
      // console.log(" all my orders", response);
      setOrders(response);
      
      // Fetch product images for web view - optimized with batch fetching
      if (isTabOrDesktop && response.length > 0) {
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
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const HeaderComponent = isTabOrDesktop ? <BrandHeaderWeb /> : <Header headerText={MY_ORDERS_SCREEN_TITLE} />;
  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <Footer />;
  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;

  return (
    <LayoutComponent
      hasFooter
      hasHeader
      scrollable
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      hasSidebar={isTabOrDesktop}
      userSidebar={true}
    >
      <View style={globalStyles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={[globalStyles.pt_0]}>
                <FlatList
                  data={isTabOrDesktop && ordersWithProducts.length > 0 
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
                    <OrderItem item={item} from="myOrders" isTabOrDesktop={isTabOrDesktop} />
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
