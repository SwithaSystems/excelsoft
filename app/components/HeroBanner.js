import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import colors from "../../constants/colors";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import Carousel from "react-native-reanimated-carousel";
import globalSettingsAPI from "@/services/globalSettingsService";

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
  const [displaySettings, setDisplaySettings] = useState(null);

  useEffect(() => {
    const getSettings = async () => {
      try {
        const response = await globalSettingsAPI.getSettings();
        setDisplaySettings(response?.data ?? null);
        console.log("Global Settings Response:", response?.data);
      } catch (error) {
        console.warn("Failed to load global settings:", error);
      }
    };
    getSettings();
  }, []);

  //  Memoize banner data
  const defaultBannerData = useMemo(
    () => [
      { id: 1, image: require("@/assets/Carousal-1.png") },
      { id: 2, image: require("@/assets/Carousal-2.png") },
      { id: 3, image: require("@/assets/Carousal-3.png") },
    ],
    []
  );

  const renderBanner = useMemo(
    () => (bannerData.length > 0 ? bannerData : defaultBannerData),
    [bannerData, defaultBannerData]
  );

  //  Memoize carousel display logic
  const shouldDisplayCarousel = useMemo(
    () => displaySettings?.displayCarousel ?? false,
    [displaySettings]
  );

  // Memoize press handler
  const handlePress = useCallback(
    (item, index) => {
      if (onBannerPress) {
        onBannerPress(item, index);
      } else {
        redirectToPage(containers.offersScreenScreen);
      }
    },
    [onBannerPress]
  );

  //  Memoize carousel item renderer
  const renderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        onPress={() => handlePress(item, index)}
        style={styles.bannerWrapper}
      >
        <Image
          source={item.image}
          style={[styles.bannerImage, { height, borderRadius }]}
        />
      </TouchableOpacity>
    ),
    [handlePress, height, borderRadius]
  );

  // Early return if settings not loaded or carousel disabled
  if (!shouldDisplayCarousel || renderBanner.length === 0) {
    return null;
  }

  return (
    <>
      <Carousel
        width={bannerWidth}
        height={height}
        data={renderBanner}
        renderItem={renderItem}
        onSnapToItem={setCurrentIndex}
        scrollAnimationDuration={scrollAnimationDuration}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        loop={loop}
      />

      {showIndicators && renderBanner.length > 1 && (
        <View style={styles.indicatorContainer}>
          {renderBanner.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={banner.id || index}
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
    width: "100%",
  },
  bannerWrapper: {
    width: "100%",
  },
  bannerImage: {
    width: "100%",
    borderRadius: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: colors.darkGray,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: colors.black,
  },
});

export default React.memo(HeroBanner);
