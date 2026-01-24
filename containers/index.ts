// This file maps route names to their corresponding module paths
// Used for navigation throughout the app

import AdminGlobalSettings from "@/app/modules/admin/AdminGlobalSettings";
import AdminNotificationSettings from "@/app/modules/admin/AdminNotificationSettings";
import AdminProfile from "@/app/modules/admin/AdminProfile";

// Ensure all route names are properly defined and match the file structure
const routes = {
  // Special routes
  index: "index",
  // Home &
  uploadScreen: "modules/home/upload",
  homeScreen: "modules/home/Home",
  searchScreen: "modules/catalog/Search",
  productDetailScreen: "modules/catalog/ProductDetail",
  searchSuggestionsScreen: "modules/catalog/SearchSuggestions",
  searchResultsScreen: "modules/catalog/SearchResults",
  categoriesScreen: "modules/catalog/Categories",
  filterScreen: "modules/catalog/Filter",
  offersScreen: "modules/catalog/Offers",

  // Splash and Welcome
  splashScreen: "modules/auth/SplashScreen",
  welcomeScreen: "modules/auth/Welcome",

  // Auth
  signInScreen: "modules/auth/SignIn",
  signUpScreen: "modules/auth/SignUp",
  verificationScreen: "modules/auth/Verification",
  forgotPasswordScreen: "modules/auth/ForgotPassword",
  passwordResetScreen: "modules/auth/PasswordReset",
  mailVerificationScreen: "modules/auth/MailVerification",
  resendMailScreen: "modules/auth/ResendMail",
  verifyUserScreen: "modules/auth/VerifyUser",

  // Cart
  cartScreen: "modules/cart/Cart",
  savedItemScreen: "modules/cart/SavedItem",

  // Checkout
  orderSummaryScreen: "modules/checkout/OrderSummery",
  paymentScreen: "modules/checkout/Payment",
  paymentSaveCardScreen: "modules/checkout/PaymentSaveCard",
  billingAddressScreen: "modules/checkout/AddBillingAddress",
  selectBillingAddressScreen: "modules/checkout/SelectBillingAddress",
  orderSuccessfulScreen: "modules/checkout/OrderSuccessful",

  // Delivery
  pickupScreen: "modules/delivery/Pickup",
  pickUpModeScreen: "modules/delivery/PickUpMode",
  storePickUpScreen: "modules/delivery/StorePickUp",
  curbsidePickupScreen: "modules/delivery/CurbsidePickup",
  homeDeliveryScreen: "modules/delivery/HomeDelivery",
  deliveryTrackingScreen: "modules/delivery/DeliveryTracking",

  // Orders
  myOrderScreen: "modules/orders/MyOrderScreen",
  orderDetailsScreen: "modules/orders/OrderDetails",
  cancelOrderScreen: "modules/orders/CancelOrder",
  returnOrderScreen: "modules/orders/ReturnOrder",
  replaceOrderScreen: "modules/orders/ReplaceOrder",

  // Profile
  userProfileScreen: "modules/profile/UserProfile",
  editProfileScreen: "modules/profile/EditProfile",
  editAccountInformationScreen: "modules/profile/EditAccountInformation",
  editContactInformationWebScreen: "modules/profile/EditContactInformationWeb",
  changePasswordScreen: "modules/profile/ChangePassword",
  addAddressScreen: "modules/profile/AddAddress",
  editAddressScreen: "modules/profile/EditAddress",
  biometricSettingsScreen: "modules/profile/BiometricSettings",
  savedAddressScreen: "modules/profile/SavedAddress",
  allPaymentsScreen: "modules/profile/AllPayments",
  updateCardDetailsScreen: "modules/profile/UpdateCardDetails",
  addNewPaymentScreen: "modules/profile/AddNewPayment",

  // Notifications
  notificationListingScreen: "modules/notifications/NotificationListing",
  userNotificationsScreen: "modules/notifications/UserNotifications",
  notificationsScreen: "modules/notifications/Notifications",
  adminNotificationSettingsScreen: "modules/admin/AdminNotificationSettings",

  // Support
  customerSupportScreen: "modules/support/CustomerSupport",
  feedbackScreen: "modules/support/FeedBack",
  appReviewScreen: "modules/support/AppReview",

  // Reviews
  reviewsScreen: "modules/reviews/Reviews",
  userReviewScreen: "modules/reviews/UserReview",

  // Admin
  AdminDashboardScreen: "modules/admin/AdminDashboard",
  AdminSeeAllOrdersScreen: "modules/admin/AdminSeeAllOrders",
  AdminOrderDetailScreen: "modules/admin/AdminOrderDetail",
  AdminProductDashboardScreen: "modules/admin/AdminProductDashboard",
  AdminProductUpdationScreen: "modules/admin/AdminProductUpdation",
  AdminStoreInformationScreen: "modules/admin/AdminStoreInformation",
  AdminOrderQRScanScreen: "modules/admin/AdminOrderQRScan",
  AdminCategoriesScreen: "modules/admin/AdminCategories",
  AdminAddCategoriesWebScreen:
    "modules/admin/componentsWeb/AdminAddCategoriesWeb",
  adminAccessControlScreen: "modules/admin/AdminAccessControl",
  adminAccessControlScreenScreen: "modules/admin/AdminAccessControl",
  fileUploadAddProductCategoryScreen:
    "modules/admin/FileUploadAddProductCategory",
  AdminGlobalSettingsScreen: "modules/admin/AdminGlobalSettings",
  AdminProfileScreen: "modules/admin/AdminProfile",
  AdminPromotionScreen: "modules/admin/AdminPromotion",
  EditPromotionScreen: "modules/admin/EditPromotion",

  // Category
  catagoryScreenScreen: "modules/catalog/Categories",

  // Dashboard
  dashBoardScreenScreen: "modules/dashboard/Dashboard",
} as const;

export default routes;
