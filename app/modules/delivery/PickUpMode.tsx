import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import Footer from "@/app/components/Footer";

// const options = [
//   {
//     id: "store",
//     label: "Store Pickup",
//     description: "Pick up your order from our store",
//     icon: "location-outline",
//     redirectionScreen: containers.pickupScreen,
//     params: { mode: DELIVERY_MODE_STORE },
//   },
//   {
//     id: "curbside",
//     label: "Curbside Pickup",
//     description: "Pick up your order curbside, right from your car.",
//     icon: "car-outline",
//     redirectionScreen: containers.pickupScreen,
//     params: { mode: DELIVERY_MODE_CURBSIDE },
//   },
//   {
//     id: "home",
//     label: "Home Delivery",
//     description: "Receive your order at your doorstep.",
//     icon: "home-outline",
//     redirectionScreen: containers.homeDeliveryScreen,
//     params: { mode: DELIVERY_MODE_HOME },
//   },
// ] as const;

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
  const [selected, setSelected] = useState<
    Partial<{ id: string; redirectionScreen: any; params: any }>
  >({});
  const [pickupModes, setPickupModes] = useState<any>([]);

  const fetchPickupModes = async () => {
    const response = await jsonAxios.get(`/pick-up-modes`);
    console.log("response pickup modes", response.data);
    setPickupModes(response.data);
  };

  useEffect(() => {
    fetchPickupModes();
  }, []);

  const options = pickupModes
    .map((mode: any) => modeConfig[mode.name])
    .filter(Boolean);

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={PICKUP_MODE_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? (
    <FooterWeb />
  ) : (
    <Footer />
  );

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter={isTabOrDesktop}
      footerComponent={isTabOrDesktop ? <FooterWeb /> : undefined}
      scrollable={false}
    >
      {isTabOrDesktop && (
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
          isTabOrDesktop
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
