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

const WEB_PULL_REFRESH_KEY = "webPullRefresh";

export const webPullToRefresh = { WEB_PULL_REFRESH_KEY };

const WebPullToRefresh: React.FC<Props> = ({ children }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const startY = useRef(0);
  const isDragging = useRef(false);
  const pullValue = useRef(0);

  const [showSpinner, setShowSpinner] = useState(false);
  const [showRefreshOverlay, setShowRefreshOverlay] = useState(false);
  const startedAtTop = useRef(false);

  // After reload: show overlay until the new page has finished loading
  useEffect(() => {
    if (Platform.OS !== "web" || typeof sessionStorage === "undefined") return;
    if (!sessionStorage.getItem(WEB_PULL_REFRESH_KEY)) return;

    setShowRefreshOverlay(true);

    const clearOverlay = () => {
      sessionStorage.removeItem(WEB_PULL_REFRESH_KEY);
      setShowRefreshOverlay(false);
    };

    const minDelayMs = 600;
    const maxWaitMs = 5000;
    const startedAt = Date.now();

    const tryClear = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, minDelayMs - elapsed);
      setTimeout(() => {
        clearOverlay();
      }, remaining);
    };

    if (document.readyState === "complete") {
      tryClear();
    } else {
      window.addEventListener("load", tryClear, { once: true });
    }

    const safety = setTimeout(clearOverlay, maxWaitMs);
    return () => {
      window.removeEventListener("load", tryClear);
      clearTimeout(safety);
    };
  }, []);

  const isAtTop = () =>
    typeof window !== "undefined" &&
    (window.scrollY === undefined || window.scrollY <= SCROLL_TOP_THRESHOLD);

    const cancelPull = () => {
      isDragging.current = false;
      pullValue.current = 0;
      startedAtTop.current = false;
      translateY.setValue(0);
    }; 
    
  useEffect(() => {
    if (Platform.OS !== "web") return;

    document.documentElement.style.overscrollBehaviorY = "contain";
    document.body.style.overscrollBehaviorY = "contain";

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        isDragging.current = false;
        return;
      }

      startedAtTop.current = isAtTop(); // capture initial state

      if (!startedAtTop.current) return;

      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        cancelPull();
        return;
      }

      if (!isDragging.current || !startedAtTop.current) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      // 🚨 CRITICAL: Only allow downward movement
      if (diff <= 0) {
        cancelPull();
        return;
      }

      const pull = Math.min(diff * 0.6, 120);
      pullValue.current = pull;
      translateY.setValue(pull);
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
        // Signal that we're refreshing so the new page shows loader until ready
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(WEB_PULL_REFRESH_KEY, Date.now().toString());
        }
        requestAnimationFrame(() => {
          setTimeout(() => {
            window.location.reload();
          }, 50);
        });
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
      {showRefreshOverlay && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.9)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
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