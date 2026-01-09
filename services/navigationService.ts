// services/navigationService.ts

import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";

export function handleNotificationNavigation(notificationData: any) {
  if (!notificationData) return;

  const { type, orderId, screen } = notificationData;

  try {
    switch (type) {
      case "order_status":
      case "delivery_scheduled":
        // Use your existing containers navigation
        redirectToPage(containers.orderDetailsScreen, { orderId });
        break;

      //   case "new_message":
      //     redirectToPage(containers.MessagesScreen, {
      //       conversationId: notificationData.conversationId,
      //     });
      //     break;

      //   case "promotion":
      //     redirectToPage(containers.PromotionsScreen);
      //     break;

      default:
        // Navigate to home or notifications screen
        redirectToPage(containers.homeScreen);
    }
  } catch (error) {
    console.error("Navigation error:", error);
  }
}
