import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
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

const options = [
  {
    id: "store",
    label: "Store Pickup",
    description: "Pick up your order from our store",
    icon: "location-outline",
    redirectionScreen: containers.pickupScreen,
    params: { mode: DELIVERY_MODE_STORE },
  },
  {
    id: "curbside",
    label: "Curbside Pickup",
    description: "Pick up your order curbside, right from your car.",
    icon: "car-outline",
    redirectionScreen: containers.pickupScreen,
    params: { mode: DELIVERY_MODE_CURBSIDE },
  },
  {
    id: "home",
    label: "Home Delivery",
    description: "Receive your order at your doorstep.",
    icon: "home-outline",
    redirectionScreen: containers.homeDeliveryScreen,
    params: { mode: DELIVERY_MODE_HOME },
  },
] as const;
const pickUpModescreen = () => {
  const [selected, setSelected] = useState<
    Partial<{ id: string; redirectionScreen: any; params: any }>
  >({});

  return (
    <PageLayout
      hasHeader
      headerComponent={<Header headerText={PICKUP_MODE_SCREEN_TITLE} />}
      hasFooter={false}
      scrollable={false}
    >
      <View style={[globalStyles.pt_0, { paddingHorizontal: 20 }]}>
        {options.map((option) => (
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
    </PageLayout>
  );
};

export default pickUpModescreen;
