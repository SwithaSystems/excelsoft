import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../app/config/colors";
function HeroBanner(props) {
  return (
    <>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>New Year Eve Special Discount!</Text>
        <Text style={styles.bannerDiscount}>40-60% Discount</Text>
        <Text style={styles.bannerText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </Text>
        <TouchableOpacity style={styles.shopNowButton}>
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
      <View style = {styles.indicatorContainer}>        
        <View style = {[styles.indicator, styles.activeIndicator]} />
        <View style = {[styles.indicator]} />
        <View style = {[styles.indicator]} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#2E2A5C",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    //height: 230,
    width: "100%",
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 24,
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

  indicatorContainer:{
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
  activeIndicator:{
    backgroundColor: colors.black,
  },
});
export default HeroBanner;
