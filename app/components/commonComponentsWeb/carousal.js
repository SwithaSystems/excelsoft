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
import { useWindowDimensions } from "react-native";

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
  const initialScrollDoneRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [arrowPressed, setArrowPressed] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [tooltip, setTooltip] = useState({
    visible: false,
    title: "",
    x: 0,
    y: 0,
  });
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isWeb = Platform.OS === "web";

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

  // Web loop: extended list [last, ...items, first] for circular/infinite scroll
  const listData = React.useMemo(() => {
    if (!isWeb || !loop || items.length <= 1) return items;
    const last = items[items.length - 1];
    const first = items[0];
    return [
      { ...last, _loopClone: "start" },
      ...items,
      { ...first, _loopClone: "end" },
    ];
  }, [isWeb, loop, items]);

  const listLength = listData.length;
  const isWebLoop = isWeb && loop && items.length > 1;

  const MAX_CONTAINER_WIDTH = 1200;

  const isDesktop = Platform.OS === "web" && screenWidth >= 1024;

  const containerWidth = isDesktop
    ? Math.min(screenWidth - 32, MAX_CONTAINER_WIDTH)
    : width;

  // Web coverflow: 30–40% viewport height on desktop; lower on mobile web
  // On mobile web, cap card width to container so carousel doesn't get cut off
  const BANNER_RATIO = 1536 / 834;
  const heightRatioWeb = isDesktop ? 0.35 : 0.25;
  const preferredHeightWeb = screenHeight * heightRatioWeb;
  let itemWidthWeb = preferredHeightWeb * BANNER_RATIO;
  let carouselHeightWeb = preferredHeightWeb;
  if (isWeb && itemWidthWeb > containerWidth * 0.9) {
    itemWidthWeb = containerWidth * 0.9;
    carouselHeightWeb = itemWidthWeb / BANNER_RATIO;
  }
  const scrollStepWeb = itemWidthWeb;

  const goTo = useCallback(
    (i, animated = true) => {
      if (!listRef.current || items.length === 0) return;
      const safeIndex = Math.max(0, Math.min(i, items.length - 1));
      const step = isWeb ? scrollStepWeb : containerWidth;
      try {
        if (isWeb) {
          const offset = isWebLoop
            ? (safeIndex + 1) * step
            : safeIndex * step;
          listRef.current.scrollToOffset({
            offset,
            animated,
          });
        } else {
          listRef.current.scrollToIndex({ index: safeIndex, animated });
        }
      } catch (err) {
        const offset = isWeb ? (isWebLoop ? (safeIndex + 1) * step : safeIndex * step) : safeIndex * containerWidth;
        listRef.current.scrollToOffset({
          offset,
          animated,
        });
      }
      setIndex(safeIndex);
    },
    [items.length, containerWidth, isWeb, isWebLoop, scrollStepWeb]
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
        if (isWeb && hovering) return;
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

  // Web loop: start with first real item in center (offset = 1 * itemWidth)
  useEffect(() => {
    if (!isWebLoop || !listRef.current) return;
    if (initialScrollDoneRef.current) return;
    initialScrollDoneRef.current = true;
    const id = requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: scrollStepWeb,
        animated: false,
      });
      setScrollOffset(scrollStepWeb);
    });
    return () => cancelAnimationFrame(id);
  }, [isWebLoop, scrollStepWeb]);

  useEffect(() => {
    if (!isWebLoop) initialScrollDoneRef.current = false;
  }, [isWebLoop]);

  const onMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const step = isWeb ? scrollStepWeb : containerWidth;
    const listIndex = Math.round(offsetX / step);

    if (isWebLoop) {
      const n = items.length;
      if (listIndex === 0) {
        setIndex(n - 1);
        setScrollOffset(n * scrollStepWeb);
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({
            offset: n * scrollStepWeb,
            animated: false,
          });
        });
        return;
      }
      if (listIndex === listLength - 1) {
        setIndex(0);
        setScrollOffset(scrollStepWeb);
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({
            offset: scrollStepWeb,
            animated: false,
          });
        });
        return;
      }
      setIndex(listIndex - 1);
      return;
    }

    setIndex(Math.max(0, Math.min(listIndex, items.length - 1)));
  };

  const onScrollWeb = useCallback(
    (e) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      setScrollOffset(offsetX);
    },
    []
  );

  const containerProps =
    isWeb
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
      if (isWeb) {
        window?.open?.(item.link, "_blank");
      } else {
        // For mobile, you can use Linking
        // Linking.openURL(item.link);
        // console.log("Open link:", item.link);
      }
    }
  }, [arrowPressed]);

  if (!items.length) return null;

  const responsiveHeight = isWeb
    ? carouselHeightWeb
    : screenHeight * 0.25;

  const handleMouseEnter = (item) => {
    if (!isWeb) return;
    if (!item?.title) return;

    setTooltip((prev) => ({
      ...prev,
      visible: true,
      title: item.title,
    }));
  };

  const handleMouseMove = (e) => {
    if (!isWeb) return;

    setTooltip((prev) => ({
      ...prev,
      x: e.clientX + 6,
      y: e.clientY + 6,
    }));
  };

  const handleMouseLeave = () => {
    if (!isWeb) return;

    setTooltip({
      visible: false,
      title: "",
      x: 0,
      y: 0,
    });
  };

  return (
    <View
      style={[
        styles.root,
        { width: containerWidth },
        isWeb && {
          height: carouselHeightWeb,
          overflow: "hidden",
          maxWidth: containerWidth,
        },
      ]}
      {...containerProps}
    >
      <FlatList
        ref={listRef}
        data={listData}
        horizontal
        pagingEnabled={!isWeb}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) =>
          item._loopClone
            ? `${item.id ?? i}-${item._loopClone}`
            : (item.id ?? i).toString()
        }
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={isWeb ? 16 : undefined}
        onScroll={isWeb ? onScrollWeb : undefined}
        snapToInterval={isWeb ? scrollStepWeb : undefined}
        snapToAlignment={isWeb ? "center" : undefined}
        decelerationRate={isWeb ? "fast" : undefined}
        contentContainerStyle={
          isWeb
            ? {
                paddingHorizontal: (containerWidth - itemWidthWeb) / 2,
              }
            : undefined
        }
        getItemLayout={(_, listIdx) => {
          const length = isWeb ? itemWidthWeb : containerWidth;
          return {
            length,
            offset: length * listIdx,
            index: listIdx,
          };
        }}
        style={{
          width: containerWidth,
          ...(isWeb && { overflow: "hidden" }),
        }}
        renderItem={({ item, index: listIdx }) => {
          const slideWidth = isWeb ? itemWidthWeb : containerWidth;
          const slideHeight = responsiveHeight;
          const distanceFromCenter = isWeb
            ? scrollOffset / itemWidthWeb - listIdx
            : 0;
          const scale = isWeb
            ? 1 - 0.15 * Math.min(Math.abs(distanceFromCenter), 1)
            : 1;
          const opacity = isWeb
            ? 1 - 0.25 * Math.min(Math.abs(distanceFromCenter), 1)
            : 1;
          const logicalIndex = isWebLoop
            ? listIdx === 0
              ? items.length - 1
              : listIdx === listLength - 1
                ? 0
                : listIdx - 1
            : listIdx;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.slide,
                {
                  width: slideWidth,
                  height: slideHeight,
                  opacity,
                  transform: [{ scale }],
                },
              ]}
              onPress={() => handleSlidePress(item, logicalIndex)}
              {...(isWeb
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
                  {renderItemExtras(item, logicalIndex)}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

        {isWeb && tooltip.visible && (
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
    ...(Platform.OS === "web" && {
      borderRadius: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 6,
    }),
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
    padding: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  title: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.92,
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
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
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
    width: 40,
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.22)",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 40,
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