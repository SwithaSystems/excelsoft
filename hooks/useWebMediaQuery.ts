import { Platform } from "react-native";
import { useMediaQuery } from "react-responsive";

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
} as const;

export const useWebMediaQuery = () => {
  const isWeb = Platform.OS === "web";

  // Media queries (always called — hooks rule)
  const mqIsMobile = useMediaQuery({ maxWidth: BREAKPOINTS.tablet - 1 });
  const mqIsTablet = useMediaQuery({
    minWidth: BREAKPOINTS.tablet,
    maxWidth: BREAKPOINTS.desktop - 1,
  });
  const mqIsDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktop });
  const mqIsLargeDesktop = useMediaQuery({ minWidth: BREAKPOINTS.largeDesktop });

  // Safely gate results for non-web
  const isMobile = isWeb && mqIsMobile;
  const isTablet = isWeb && mqIsTablet;
  const isDesktop = isWeb && mqIsDesktop;
  const isLargeDesktop = isWeb && mqIsLargeDesktop;

  return {
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTabletOrLarger: isTablet || isDesktop || isLargeDesktop,
    isDesktopOrLarger: isDesktop || isLargeDesktop,
    breakpoints: BREAKPOINTS,
  };
};
