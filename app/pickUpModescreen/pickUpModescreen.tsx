import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./pickUpModescreenStyles";
import colors from "../config/colors";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/commonComponents/Button";
import { router, useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const options = [
  {
    id: "store",
    label: "Store Pickup",
    description: "Pick up your order from our store",
    icon: "location-outline",
    redirectionScreen: containers.pickupScreenScreen,
    params: { mode: "store" },

  },
  {
    id: "curbside",
    label: "Curbside Pickup",
    description: "Pick up your order curbside, right from your car.",
    icon: "car-outline",
    redirectionScreen: containers.pickupScreenScreen,
    params: { mode: "curbside" },

  },
  {
    id: "home",
    label: "Home Delivery",
    description: "Receive your order at your doorstep.",
    icon: "home-outline",
    redirectionScreen: containers.homeDeliveryScreenScreen,
    params: { mode: "home" },
  },
];
const pickUpModescreen = () => {
  const [selected, setSelected] = useState<Partial<{ id: string; redirectionScreen: any; params:any  }>>({});


  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <Header headerText="Pick up Options" />
        <View
          style={[
            globalStyles.sectionContent,
            globalStyles.pt_0,
            { paddingHorizontal: 40 },
          ]}
        >
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
                <Ionicons
                  name={option.icon as string}
                  size={24}
                  color={colors.black}
                  // style={styles.icon}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
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
                redirectToPage(selected?.redirectionScreen,selected?.params);
                }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default pickUpModescreen;
