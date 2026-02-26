import React, { useEffect, useRef, useState, ReactNode } from "react";
import {
  View,
  ActivityIndicator,
  Platform,
  Animated,
} from "react-native";

interface Props {
  children: ReactNode;
}

const SCROLL_TOP_THRESHOLD = 10; // Only allow pull-to-refresh when scroll is within this from top

const WebPullToRefresh: React.FC<Props> = ({ children }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const startY = useRef(0);
  const isDragging = useRef(false);
  const pullValue = useRef(0);

  const [showSpinner, setShowSpinner] = useState(false);

  const isAtTop = () =>
    typeof window !== "undefined" &&
    (window.scrollY === undefined || window.scrollY <= SCROLL_TOP_THRESHOLD);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    document.documentElement.style.overscrollBehaviorY = "contain";
    document.body.style.overscrollBehaviorY = "contain";

    const handleTouchStart = (e: TouchEvent) => {
      // Ignore multi-touch (pinch zoom) so zoom doesn't trigger refresh
      if (e.touches.length >= 2) {
        isDragging.current = false;
        return;
      }
      // Only start pull gesture when page is scrolled to top (avoids triggering on scroll-up)
      if (!isAtTop()) return;

      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Cancel pull on multi-touch (e.g. second finger for pinch zoom)
      if (e.touches.length >= 2) {
        isDragging.current = false;
        pullValue.current = 0;
        translateY.setValue(0);
        return;
      }
      if (!isDragging.current) return;

      // If user scrolled the page (not at top anymore), cancel pull
      if (!isAtTop()) {
        isDragging.current = false;
        pullValue.current = 0;
        translateY.setValue(0);
        return;
      }

      const diff = e.touches[0].clientY - startY.current;

      if (diff > 0) {
        const pull = Math.min(diff * 0.6, 120);
        pullValue.current = pull;
        translateY.setValue(pull);
      }
    };

    const handleTouchEnd = () => {
      const shouldRefresh = pullValue.current > 80;

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }).start();

      if (shouldRefresh) {
        setShowSpinner(true);

        setTimeout(() => {
          setShowSpinner(false);
          window.location.reload();
        }, 700); // spinner visible briefly
      }

      isDragging.current = false;
      pullValue.current = 0;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [translateY]);

  return (
    <View style={{ flex: 1 }}>
      {showSpinner && (
        <View
          style={{
            position: "absolute",
            top: 25,
            alignSelf: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      )}

      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY }],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default WebPullToRefresh;