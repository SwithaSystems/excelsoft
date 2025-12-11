import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform,
  Text,
} from "react-native";

const { width } = Dimensions.get("window");

interface ProductImageCarouselProps {
  images: string[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  height = 300,
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const scrollViewRef = useRef<ScrollView | null>(null);
  const indexRef = useRef(0);

  // Filter out placeholder images and invalid URLs
  const validImages = images.filter(
    (url) =>
      url &&
      url.trim() !== "" &&
      !url.includes("Placeholder.png") &&
      !imageErrors[images.indexOf(url)]
  );

  // Handle image load errors
  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (
      !validImages.length ||
      validImages.length === 1 ||
      !scrollViewRef.current ||
      !autoPlay ||
      Platform.OS === "web"
    ) {
      return;
    }

    const interval = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % validImages.length;

      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });

      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [validImages.length, autoPlay, autoPlayInterval]);

  // Handle scroll event to update current index
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
    indexRef.current = index;
  };

  // If no valid images, return null (don't render anything)
  if (validImages.length === 0) {
    return null;
  }

  // If only one image, show it without carousel
  if (validImages.length === 1) {
    return (
      <View style={[styles.singleImageContainer, { height }]}>
        <Image
          source={{ uri: validImages[0] }}
          style={styles.singleImage}
          resizeMode="contain"
          onError={() => handleImageError(0)}
        />
      </View>
    );
  }

  // Multiple images - show carousel
  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[styles.scrollView, { height }]}
      >
        {validImages.map((imageUrl, index) => (
          <View key={index} style={[styles.imageContainer, { width }]}>
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, { height }]}
              resizeMode="contain"
              onError={() => handleImageError(images.indexOf(imageUrl))}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {validImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: "100%",
  },
  singleImageContainer: {
    width: "100%",
    backgroundColor: "#fff",
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    width: "100%",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#000",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default ProductImageCarousel;