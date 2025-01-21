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
</Stack>
  );
}
