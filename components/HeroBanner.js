import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../app/config/colors";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const bannerData = [
  {
    title: "New Year Eve Special discount!",
    discount: "40-60% Discount",
    description: "Limited time offers on all products",
    backgroundColor: "#2E2A5C",
  },
  {
    title: "Flash Sale This Weekend!",
    discount: "Up to 70% Off!",
    description: "Don't miss out on hot deals!",
    backgroundColor: colors.starColor,
  },
  {
    title: "Clearance Sale!",
    discount: "upto 50% Discount",
    description: "Stock Clearance on selected items!",
    backgroundColor: colors.black,
  },
];

function HeroBanner(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <>
      <Carousel
        width={width - 32}
        height={230}
        data={bannerData}
        onSnapToItem={(index) => setCurrentIndex(index)}
        scrollAnimationDuration={300}
        renderItem={({ item }) => (
          <View
            style={[styles.banner, { backgroundColor: item.backgroundColor }]}
          >
            <Text style={styles.bannerTitle}>{item.title}</Text>
            <Text style={styles.bannerDiscount}>{item.discount}</Text>
            <Text style={styles.bannerText}>{item.description}</Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={() => redirectToPage(containers.offersScreenScreen)}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        )}
        loop
        autoPlayInterval={5000}
        autoPlay
      />

      {/* <View style={styles.banner}>
        <Text style={styles.bannerTitle}>New Year Eve Special Discount!</Text>
        <Text style={styles.bannerDiscount}>40-60% Discount</Text>
        <Text style={styles.bannerText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </Text>
        <TouchableOpacity style={styles.shopNowButton} onPress={(e)=>{redirectToPage(containers.offersScreenScreen)}}>
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.indicatorContainer}>
        {bannerData.map((banner, index) => {
          const isActive = currentIndex === index;
          return (
            <View
              key={index}
              style={[styles.indicator, isActive && styles.activeIndicator]}
            />
          );
        })}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  banner: {
    //backgroundColor: "#2E2A5C",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    //height: 230,
    width: "100%",
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  bannerDiscount: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bannerText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  shopNowText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#989B9C",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: colors.black,
  },
});
export default HeroBanner;
