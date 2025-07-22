import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import colors from "../config/colors";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

function HeroBanner({
  bannerData = [],
  onBannerPress,
  showIndicators = true,
  autoPlay = true,
  autoPlayInterval = 5000,
  height = 230,
  bannerWidth = width - 32,
  borderRadius = 20,
  loop = true,
  activeIndicatorStyle = {},
  scrollAnimationDuration = 300,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultBannerData = [
    {
      id: 1,
      image: require("@/assets/Carousal-1.png"),
    },
    {
      id: 2,
      image: require("@/assets/Carousal-2.png"),
    },
    {
      id: 3,
      image: require("@/assets/Carousal-3.png"),
    },
  ];

  const renderBanner = bannerData.length > 0 ? bannerData : defaultBannerData;

  const handlePress = (item, index) => {
    if (onBannerPress) {
      onBannerPress(item, index);
    } else {
      redirectToPage(containers.offersScreenScreen);
    }
  };

  if (renderBanner.length === 0) {
    return null;
  }

  return (
    <>
      <Carousel
        width={bannerWidth}
        height={height}
        data={renderBanner}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handlePress(item, index)}
            style={styles.bannerWrapper}
          >
            <Image
              source={item.image}
              style={[styles.bannerImage, { height, borderRadius }]}
            />
          </TouchableOpacity>
        )}
        onSnapToItem={setCurrentIndex}
        scrollAnimationDuration={scrollAnimationDuration}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        loop={loop}
        //   renderItem={({ item }) => (
        //     <View
        //       style={[styles.banner, { backgroundColor: item.backgroundColor }]}
        //     >
        //       <Text style={styles.bannerTitle}>{item.title}</Text>
        //       <Text style={styles.bannerDiscount}>{item.discount}</Text>
        //       <Text style={styles.bannerText}>{item.description}</Text>
        //       <TouchableOpacity
        //         style={styles.shopNowButton}
        //         onPress={() => redirectToPage(containers.offersScreenScreen)}
        //       >
        //         <Text style={styles.shopNowText}>Shop Now</Text>
        //       </TouchableOpacity>
        //     </View>
        //   )}
        //   loop
        //   autoPlayInterval={5000}
        //   autoPlay
      />

      {/* <View style={styles.indicatorContainer}>
        {bannerData.map((banner, index) => {
          const isActive = currentIndex === index;
          return (
            <View
              key={index}
              style={[styles.indicator, isActive && styles.activeIndicator]}
            />
          );
        })}
      </View> */}
      {showIndicators && renderBanner.length > 1 && (
        <View style={styles.indicatorContainer}>
          {renderBanner.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.indicator,
                  isActive && [styles.activeIndicator, activeIndicatorStyle],
                ]}
              />
            );
          })}
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  banner: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    //height: 230,
    width: "100%",
  },
  bannerWrapper: {
    width: "100%",
  },
  bannerImage: {
    width: "100%",
    borderRadius: 20,
  },
  // bannerTitle: {
  //   color: colors.white,
  //   fontSize: 17,
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   marginBottom: 10,
  // },
  // bannerDiscount: {
  //   color: colors.white,
  //   fontSize: 28,
  //   fontWeight: "bold",
  //   marginBottom: 10,
  // },
  // bannerText: {
  //   color: colors.white,
  //   fontSize: 16,
  //   textAlign: "center",
  //   marginBottom: 20,
  // },
  // shopNowButton: {
  //   backgroundColor: "rgba(255, 255, 255, 0.2)",
  //   paddingHorizontal: 30,
  //   paddingVertical: 10,
  //   borderRadius: 25,
  // },
  // shopNowText: {
  //   color: colors.white,
  //   fontSize: 16,
  //   fontWeight: "500",
  // },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: colors.neutralGrey2,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: colors.black,
  },
});
export default HeroBanner;
