import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
} from "react-native";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

function normalizeImage(image) {
  if (typeof image === "object" && image?.uri) return image;
  if (typeof image === "string") return { uri: image };
  return image;
}

function preparePromotionalData(backendData) {
  if (!Array.isArray(backendData) || backendData.length === 0) {
    return [];
  }

  return backendData.map((item) => ({
    id: item.id,
    image: item.imageUrl || item.image || "",
    link: item.link || null, // Preserved for future CMS usage
    title: item.title || "",
    description: item.description || "",
    onPress: item.onPress,
    isInternalLink: item.isInternalLink, // Metadata only
    category: item.category, // For category-based navigation
    products: item.products, // For product-based navigation (offers)
  }));
}

/**
 * @param {CarouselWebProps} props
 */
export default function CarouselWeb({
  data = [],
  width = WINDOW_WIDTH - 32,
  // height = 230,
  autoPlay = true,
  autoPlayInterval = 4500,
  loop = true,
  showArrows = true,
  showIndicators = true,
  borderRadius = 12,
  indicatorStyle = {},
  activeIndicatorStyle = {},
  renderItemExtras = null,
  showOverlay = false,
  isPromotional = false,
}) {
  const listRef = useRef(null);
  const autoplayRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [arrowPressed, setArrowPressed] = useState(false);

  // Process data based on whether it's promotional content
  const items = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    // If promotional mode, transform the data
    if (isPromotional) {
      return preparePromotionalData(data);
    }
    
    // Otherwise, use data as is (existing behavior)
    return data;
  }, [data, isPromotional]);

  const MAX_CONTAINER_WIDTH = 1200;
  const containerWidth = Math.min(WINDOW_WIDTH - 32, MAX_CONTAINER_WIDTH);

  const goTo = useCallback(
    (i, animated = true) => {
      if (!listRef.current || items.length === 0) return;
      const safeIndex = Math.max(0, Math.min(i, items.length - 1));
      try {
        listRef.current.scrollToIndex({ index: safeIndex, animated });
      } catch (err) {
        listRef.current.scrollToOffset({ offset: safeIndex * width, animated });
      }
      setIndex(safeIndex);
    },
    [items.length, width]
  );

  const next = useCallback(() => {
    if (items.length === 0) return;
    let nextIndex = index + 1;
    if (nextIndex >= items.length) {
      if (loop) nextIndex = 0;
      else nextIndex = items.length - 1;
    }
    goTo(nextIndex);
  }, [goTo, index, items.length, loop]);

  const prev = useCallback(() => {
    if (items.length === 0) return;
    let prevIndex = index - 1;
    if (prevIndex < 0) {
      if (loop) prevIndex = items.length - 1;
      else prevIndex = 0;
    }
    goTo(prevIndex);
  }, [goTo, index, items.length, loop]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    function start() {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => {
        if (Platform.OS === "web" && hovering) return;
        next();
      }, autoPlayInterval);
    }

    start();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoPlay, autoPlayInterval, items.length, next, hovering]);

  useEffect(() => {
    if (index >= items.length) setIndex(Math.max(0, items.length - 1));
  }, [items.length, index]);

  const onMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setIndex(newIndex);
  };

  const containerProps =
    Platform.OS === "web"
      ? {
          onMouseEnter: () => setHovering(true),
          onMouseLeave: () => setHovering(false),
        }
      : {};

  const handleArrowPress = useCallback((direction) => {
    setArrowPressed(true);
    if (direction === "next") {
      next();
    } else {
      prev();
    }
    // Reset arrow pressed state after a short delay
    setTimeout(() => setArrowPressed(false), 300);
  }, [next, prev]);

  const handleSlidePress = useCallback((item, idx) => {
    // Don't trigger slide press if arrow was just pressed
    if (arrowPressed) {
      return;
    }

    // For internal links, only call onPress handler (don't open URL)
    if (item.onPress) {
      item.onPress(item, idx);
      return; // Prevent any further URL navigation
    }
    // For external links without custom handler, open the URL
    if (item.link && !item.isInternalLink) {
      if (Platform.OS === "web") {
        window?.open?.(item.link, "_blank");
      } else {
        // For mobile, you can use Linking
        // Linking.openURL(item.link);
        // console.log("Open link:", item.link);
      }
    }
  }, [arrowPressed]);

  if (!items.length) return null;

  const BANNER_RATIO = 1536 / 834;
  const calculatedHeight = width / BANNER_RATIO;
  const minHeightPercent = 0.28;
  const maxHeightPercent = 0.55;
  const minHeight = WINDOW_HEIGHT * minHeightPercent;
  const maxHeight = WINDOW_HEIGHT * maxHeightPercent;
  const responsiveHeight = Math.min(Math.max(calculatedHeight, minHeight), maxHeight);

  const [tooltip, setTooltip] = useState({
    visible: false,
    title: "",
    x: 0,
    y: 0,
  });

  const handleMouseEnter = (item) => {
    if (Platform.OS !== "web") return;
    if (!item?.title) return;

    setTooltip((prev) => ({
      ...prev,
      visible: true,
      title: item.title,
    }));
  };

  const handleMouseMove = (e) => {
    if (Platform.OS !== "web") return;

    setTooltip((prev) => ({
      ...prev,
      x: e.clientX + 6,
      y: e.clientY + 6,
    }));
  };

  const handleMouseLeave = () => {
    if (Platform.OS !== "web") return;

    setTooltip({
      visible: false,
      title: "",
      x: 0,
      y: 0,
    });
  };

  return (
    <View style={[styles.root, { width }]} {...containerProps}>
      <FlatList
        ref={listRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => (item.id ?? i).toString()}
        renderItem={({ item, index: idx }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.slide, { width, height: responsiveHeight }]}
            onPress={() => handleSlidePress(item, idx)}
            {...(Platform.OS === "web"
              ? {
                  onMouseEnter: () => handleMouseEnter(item),
                  onMouseMove: handleMouseMove,
                  onMouseLeave: handleMouseLeave,
                }
              : {})}
          >
            <Image
              source={normalizeImage(item.image)}
              style={{ width: "100%", height: "100%", borderRadius }}
              resizeMode="cover"
              onError={(e) =>
                console.warn("CarouselWeb image error:", e?.nativeEvent ?? e)
              }
            />
            
            {showOverlay && (item.title || item.description) && (
              <View style={styles.overlay}>
                {item.title && (
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                )}
                {item.description && (
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>
            )}
            
            {typeof renderItemExtras === "function" && (
              <View style={styles.extrasContainer}>
                {renderItemExtras(item, idx)}
              </View>
            )}
          </TouchableOpacity>
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        style={{ width }}
      />

        {Platform.OS === "web" && tooltip.visible && (
          <View
            style={[
              styles.tooltip,
              {
                left: tooltip.x,
                top: tooltip.y,
              },
            ]}
          >
            <Text style={styles.tooltipText}>{tooltip.title}</Text>
          </View>
        )}

      {showArrows && items.length > 1 && (
        <>
          {/* Left Arrow with larger touchable area */}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => handleArrowPress("prev")}
            style={styles.leftArrowTouchArea}
            hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
          >
            <View style={[styles.arrow, styles.leftArrow]}>
              <Text style={styles.arrowText}>‹</Text>
            </View>
          </TouchableOpacity>

          {/* Right Arrow with larger touchable area */}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => handleArrowPress("next")}
            style={styles.rightArrowTouchArea}
            hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
          >
            <View style={[styles.arrow, styles.rightArrow]}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

      {showIndicators && items.length > 1 && (
        <View style={styles.indicatorContainer}>
          {items.map((_, i) => {
            const active = i === index;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => goTo(i)}
                style={[
                  styles.indicator,
                  indicatorStyle,
                  active && [styles.activeIndicator, activeIndicatorStyle],
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
    position: "relative",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  extrasContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  leftArrowTouchArea: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 80, // Larger touchable area
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 8,
    zIndex: 20,
  },
  rightArrowTouchArea: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 80, // Larger touchable area
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 8,
    zIndex: 20,
  },
  arrow: {
    backgroundColor: "rgba(255,255,255,0.7)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  leftArrow: {
    // Removed position absolute - now inside touch area
  },
  rightArrow: {
    // Removed position absolute - now inside touch area
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "600",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 30,
  },
  indicator: {
    width: 36,
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
    marginHorizontal: 6,
  },
  activeIndicator: {
    backgroundColor: "rgba(0,0,0,0.85)",
  },

  tooltip: {
    position: "fixed",
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    zIndex: 9999,
    pointerEvents: "none",
    maxWidth: 300,
  },

  tooltipText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
});