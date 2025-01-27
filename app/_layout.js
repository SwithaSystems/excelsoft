import containers from '../containers';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'ExcelSoft',
        }}
      />
      <Stack.Screen name={containers.homeScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.searchScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.productDetailScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.searchResultsScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.searchSuggesionsScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.welcomeScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.signInScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.catagoryScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.reviewsScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.userReviewScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.cartScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.pickUpModescreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.storePickUpScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.curbsidePickupScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.homeDeliveryScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.orderSummeryScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.paymentScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.paymentSaveCardScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.billingAddressScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.orderSuccessfulScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.deliveryTrackingScreenScreen} options={{ headerShown: false }} />
  <Stack.Screen name={containers.offersScreenScreen} options={{ headerShown: false }} />
</Stack>
  );
}
