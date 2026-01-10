// services/navigationService.ts
 
import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";
import { orderService } from "./orderService";
 
export async function handleNotificationNavigation(notificationData: any) {
  if (!notificationData) return;
 
  const { type, orderId, orderNumber, screen } = notificationData;
 
  try {
    switch (type) {
      case "order_status":
      case "order_delivery":
      case "delivery_scheduled":
        if (orderId) {
          console.log("Fetching order data for orderId:", orderId);
 
          try {
            // Fetch the complete order data first
            const orderData = await orderService.getOrderByOrderNumber(
              orderId.toString()
            );
            console.log("Order data fetched successfully:", orderData);
 
            // Navigate with the complete order data
            redirectToPage(containers.orderDetailsScreen, {
              orderData: JSON.stringify(orderData),
              orderId: orderId.toString(),
              from: "notification",
            });
          } catch (error) {
            console.error("Error fetching order data:", error);
            // Fallback: try to navigate with just orderId
            redirectToPage(containers.orderDetailsScreen, {
              orderId: orderId.toString(),
              from: "notification",
            });
          }
        } else if (orderNumber) {
          // If only orderNumber is provided
          console.log("Fetching order data for orderNumber:", orderNumber);
 
          try {
            const orderData = await orderService.getOrderById(
              orderNumber.toString()
            );
            console.log("Order data fetched successfully:", orderData);
 
            redirectToPage(containers.orderDetailsScreen, {
              orderData: JSON.stringify(orderData),
              orderId: orderNumber.toString(),
              from: "notification",
            });
          } catch (error) {
            console.error("Error fetching order data:", error);
            redirectToPage(containers.homeScreen);
          }
        } else {
          console.warn("No orderId or orderNumber in notification data");
          redirectToPage(containers.homeScreen);
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
        console.log("Unknown notification type:", type);
        redirectToPage(containers.homeScreen);
    }
  } catch (error) {
    console.error("Navigation error:", error);
    // Fallback to home screen on error
    redirectToPage(containers.homeScreen);
  }
}