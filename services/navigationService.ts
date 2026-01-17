// services/navigationService.ts
 
import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";
import { orderService } from "./orderService";
 
export async function handleNotificationNavigation(notificationData: any) {
  if (!notificationData) {
    console.log("No notification data provided");
    redirectToPage(containers.myOrderScreen);
    return;
  }

  console.log("📱 Handling notification navigation with data:", JSON.stringify(notificationData, null, 2));

  const { type, orderId, orderNumber } = notificationData;
  
  // Normalize order identifier - check both orderId and orderNumber
  // Also check for common variations like order_id, order_number
  const orderIdentifier = 
    orderId || 
    orderNumber || 
    notificationData.order_id || 
    notificationData.order_number ||
    notificationData.orderId ||
    notificationData.orderNumber;

  try {
    // Check if this is an order-related notification
    const isOrderNotification = 
      type === "order_status" ||
      type === "order_delivery" ||
      type === "delivery_scheduled" ||
      type === "orderUpdate" ||
      orderIdentifier; // If we have an order identifier, treat it as order notification

    if (isOrderNotification && orderIdentifier) {
      console.log("📦 Order notification detected. Order ID/Number:", orderIdentifier);

      try {
        // Try to fetch order data using orderNumber first (most common)
        let orderData = null;
        try {
          orderData = await orderService.getOrderByOrderNumber(orderIdentifier.toString());
          console.log("✅ Order data fetched by orderNumber:", orderData);
        } catch (error1) {
          console.log("⚠️ Failed to fetch by orderNumber, trying by ID...");
          try {
            orderData = await orderService.getOrderById(orderIdentifier.toString());
            console.log("✅ Order data fetched by orderId:", orderData);
          } catch (error2) {
            console.error("❌ Failed to fetch order data:", error2);
          }
        }

        if (orderData) {
          // Navigate to order details with complete data
          redirectToPage(containers.orderDetailsScreen, {
            orderData: JSON.stringify(orderData),
            orderId: orderIdentifier.toString(),
            from: "notification",
          });
        } else {
          // Fallback: navigate with just orderId
          console.log("⚠️ Navigating with orderId only (no order data)");
          redirectToPage(containers.orderDetailsScreen, {
            orderId: orderIdentifier.toString(),
            from: "notification",
          });
        }
      } catch (error) {
        console.error("❌ Error in order navigation:", error);
        // Fallback to orders list page instead of home
        redirectToPage(containers.myOrderScreen);
      }
      return;
    }

    // Handle specific notification types
    switch (type) {
      case "order_status":
      case "order_delivery":
      case "delivery_scheduled":
      case "orderUpdate":
        // This should have been handled above, but just in case
        if (orderIdentifier) {
          redirectToPage(containers.orderDetailsScreen, {
            orderId: orderIdentifier.toString(),
            from: "notification",
          });
        } else {
          console.log("⚠️ Order notification without orderId/orderNumber");
          redirectToPage(containers.myOrderScreen);
        }
        break;
 
      case "new_message":
        // Uncomment when ready
        // redirectToPage(containers.MessagesScreen, {
        //   conversationId: notificationData.conversationId,
        // });
        redirectToPage(containers.homeScreen);
        break;
 
      case "promotion":
        // Uncomment when ready
        // redirectToPage(containers.PromotionsScreen);
        redirectToPage(containers.homeScreen);
        break;
 
      default:
        console.log("ℹ️ Unknown notification type:", type);
        // If we have an order identifier even without a known type, try to navigate to orders
        if (orderIdentifier) {
          console.log("📦 Attempting to navigate to order with identifier:", orderIdentifier);
          redirectToPage(containers.orderDetailsScreen, {
            orderId: orderIdentifier.toString(),
            from: "notification",
          });
        } else {
          // Fallback to orders list instead of home
          redirectToPage(containers.myOrderScreen);
        }
    }
  } catch (error) {
    console.error("❌ Navigation error:", error);
    // Fallback to orders list page instead of home screen
    redirectToPage(containers.myOrderScreen);
  }
}