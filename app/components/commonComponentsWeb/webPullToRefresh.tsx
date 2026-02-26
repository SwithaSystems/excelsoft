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

const WebPullToRefresh: React.FC<Props> = ({ children }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const startY = useRef(0);
  const isDragging = useRef(false);
  const pullValue = useRef(0);

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    document.documentElement.style.overscrollBehaviorY = "contain";
    document.body.style.overscrollBehaviorY = "contain";

    const handleTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

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