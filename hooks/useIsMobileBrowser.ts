import { useState, useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";

/**
 * Hook to detect if the app is running in a mobile browser
 * This is different from Platform.OS detection because on mobile browsers,
 * Platform.OS will be "web" but we need to treat it as mobile for layout purposes
 */
export const useIsMobileBrowser = () => {
  const { width } = useWindowDimensions();
  const [isMobileBrowser, setIsMobileBrowser] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      // Not web platform, so not a mobile browser
      setIsMobileBrowser(false);
      return;
    }

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      setIsMobileBrowser(false);
      return;
    }

    // Check for touch capability (mobile browsers have touch)
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );

    // Check viewport width (mobile browsers typically have smaller viewports)
    // Also check if the device has a small screen
    const isSmallScreen = width < 768;

    // Consider it a mobile browser if:
    // 1. It has touch capability AND (small screen OR mobile user agent)
    // 2. OR just small screen (for responsive design)
    const shouldUseMobileLayout = (hasTouch && (isSmallScreen || isMobileUserAgent)) || isSmallScreen;

    setIsMobileBrowser(shouldUseMobileLayout);
  }, [width]);

  return isMobileBrowser;
};

export default useIsMobileBrowser;
