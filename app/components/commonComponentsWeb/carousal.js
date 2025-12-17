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

const { width: WINDOW_WIDTH } = Dimensions.get("window");

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
    link: item.link || null,
    title: item.title || "",
    description: item.description || "",
    // Preserve custom properties for internal link handling
    onPress: item.onPress,
    isInternalLink: item.isInternalLink,
  }));
}

/**
 * @param {CarouselWebProps} props
 */
export default function CarouselWeb({
  data = [],
  width = WINDOW_WIDTH - 32,
  height = 230,
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

  if (!items.length) return null;

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
            style={[styles.slide, { width, height }]}
            onPress={() => {
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
            }}
          >
            <Image
              source={normalizeImage(item.image)}
              style={{ width, height, borderRadius }}
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

      {showArrows && items.length > 1 && (
        <>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={prev}
            style={[styles.arrow, styles.leftArrow]}
          >
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={next}
            style={[styles.arrow, styles.rightArrow]}
          >
            <Text style={styles.arrowText}>›</Text>
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
  arrow: {
    position: "absolute",
    top: "45%",
    zIndex: 20,
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
    left: 8,
  },
  rightArrow: {
    right: 8,
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
});