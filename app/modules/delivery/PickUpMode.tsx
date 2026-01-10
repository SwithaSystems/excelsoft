import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import styles from "./PickUpModeStyles";
import colors from "../../../constants/colors";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/app/components/commonComponents/Button";
import { router, useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import {
  DELIVERY_MODE_CURBSIDE,
  DELIVERY_MODE_HOME,
  DELIVERY_MODE_STORE,
  PICKUP_MODE_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { jsonAxios } from "@/services/axiosConfig";
import globalSettingsAPI from "@/services/globalSettingsService";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import Footer from "@/app/components/Footer";

const modeConfig: Record<
  string,
  {
    id: string;
    label: string;
    description: string;
    icon: string;
    redirectionScreen: string;
    params: { mode: string };
  }
> = {
  "Store Pickup": {
    id: "store",
    label: "Store Pickup",
    description: "Pick up your order from our store",
    icon: "location-outline",
    redirectionScreen: containers.pickupScreen,
    params: { mode: DELIVERY_MODE_STORE },
  },
  "Curbside Pickup": {
    id: "curbside",
    label: "Curbside Pickup",
    description: "Pick up your order curbside, right from your car.",
    icon: "car-outline",
    redirectionScreen: containers.pickupScreen,
    params: { mode: DELIVERY_MODE_CURBSIDE },
  },
  "Home Delivery": {
    id: "home",
    label: "Home Delivery",
    description: "Receive your order at your doorstep.",
    icon: "home-outline",
    redirectionScreen: containers.homeDeliveryScreen,
    params: { mode: DELIVERY_MODE_HOME },
  },
};

const pickUpModescreen = () => {
  // MOVE ALL HOOKS TO THE TOP - before any conditional returns
  const [selected, setSelected] = useState<
    Partial<{ id: string; redirectionScreen: any; params: any }>
  >({});
  const [pickupModes, setPickupModes] = useState<any>([]);
  const [deliveryModeEnabled, setDeliveryModeEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGlobalSettings = async () => {
    try {
      const response = await globalSettingsAPI.getSettings();
      // console.log("response global settings", response.data);
      setDeliveryModeEnabled(response.data?.deliveryMode);
    } catch (error) {
      console.error("Failed to fetch global settings:", error);
      setDeliveryModeEnabled(true);
    }
  };

  const fetchPickupModes = async () => {
    const response = await jsonAxios.get(`/pick-up-modes`);
    // console.log("response pickup modes", response.data);
    setPickupModes(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchGlobalSettings(), fetchPickupModes()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const options = pickupModes
    .map((mode: any) => modeConfig[mode.name])
    .filter((option: any) => {
      if (option?.id === "home") {
        return deliveryModeEnabled;
      }
      return Boolean(option);
    });

  // console.log("Final options:", options);

  const isWeb = Platform.OS === "web";

  // Now the loading check comes AFTER all hooks
  if (loading) {
    return (
      <PageLayout
        hasHeader
        headerComponent={<Header headerText={PICKUP_MODE_SCREEN_TITLE} />}
        hasFooter={false}
        scrollable={isWeb}
      >
        <View style={[globalStyles.pt_0, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading pickup modes...</Text>
        </View>
      </PageLayout>
    );
  }

  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={PICKUP_MODE_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <Footer />;

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter={isWeb}
      footerComponent={isWeb ? <FooterWeb /> : undefined}
      scrollable={true}
    >
      {isWeb && (
        <Text
          style={{
            fontSize: 28,
            fontWeight: "300",
            marginBottom: 20,
            color: colors.black,
            textAlign: "center",
            width: "100%",
            marginTop: 20,
          }}
        >
          {PICKUP_MODE_SCREEN_TITLE}
        </Text>
      )}

      <View
        style={[
          globalStyles.pt_0,
          isWeb
            ? {
                width: "70%",
                alignSelf: "center",
                paddingVertical: 20,
              }
            : { paddingHorizontal: 0 },
        ]}
      >
        {options.map((option: any) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selected?.id == option.id && styles.selectedOption,
            ]}
            onPress={() => setSelected(option)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={option.icon} size={24} color={colors.black} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <View style={styles.radioCircle}>
              {selected.id === option.id && (
                <View style={styles.selectedRadio} />
              )}
            </View>
          </TouchableOpacity>
        ))}
        <Button
          title="Continue"
          onPress={() => {
            if (selected?.id) {
              redirectToPage(selected?.redirectionScreen, selected?.params);
            }
          }}
          disabled={!selected?.id}
          style={!selected?.id ? styles.disabledButton : {}}
          textStyle={!selected?.id ? styles.buttonText_disabled : {}}
        />
      </View>
    </LayoutComponent>
  );
};

export default pickUpModescreen;
