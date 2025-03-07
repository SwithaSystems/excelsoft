import { Stack } from "expo-router";
import SplashScreen from "../components/commonComponents/SplashScreen";
import containers from "../containers";
import { AppProvider, useAppContext } from "../context/AppContext";
import { Provider } from 'react-redux';
import { store } from '../store/store';

const LayoutContent = () => {
  const { isLoading, setIsLoading } = useAppContext();
  return (
    <>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "ExcelSoft",
            }}
          />
          <Stack.Screen
            name={containers.homeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.searchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.productDetailScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.searchResultsScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.searchSuggesionsScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.welcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.signInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.catagoryScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.reviewsScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.userReviewScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.cartScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.pickUpModescreenScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name={containers.pickUpscreenScreen}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name={containers.storePickUpScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.curbsidePickupScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.homeDeliveryScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.orderSummeryScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.paymentScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.paymentSaveCardScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.billingAddressScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.orderSuccessfulScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.deliveryTrackingScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.offersScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.welcomeScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.signUpScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.mailVerificationScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.resedMailScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.verifcationScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.passwordResetScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.verifyUserScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.forgotPasswordScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.userProfileScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.editProfileScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.editAccountInformationscreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.changePasswordScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.notificationsScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.customerSupportScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.myOrderScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.orderDetailsScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.savedItemScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.savedAddressScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.editAddressScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.allPaymentsScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.updateCardDetailsScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.addNewPaymentScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.feedBackScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.dashBoardScreenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.filterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.AdminDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.AdminSeeAllOrdersScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.AdminOrderDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.AdminProductDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.AdminProductUpdationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.AdminStoreInformationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={containers.AdminOrderQRScanScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen name={containers.categoriesScreeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={containers.pickupScreenScreen} options={{ headerShown: false }} />

</Stack>
      )}
    </>
  );
};

export default function Layout() {
  return (
    <Provider store={store}>
      <AppProvider>
        <LayoutContent />
      </AppProvider>
    </Provider>
  );
}
