import React from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { globalStyles } from "@/assets/styles/globalStyles";
import colors from "./config/colors";

interface PageLayoutProps {
  children: React.ReactNode;
  hasHeader?: boolean;
  hasFooter?: boolean;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  contentPadding?: boolean;
  // New props for better safe area control
  ignoreSafeAreaTop?: boolean;
  ignoreSafeAreaBottom?: boolean;
  customTopPadding?: number;
  customBottomPadding?: number;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  hasHeader = false,
  hasFooter = false,
  headerComponent,
  footerComponent,
  scrollable = true,
  backgroundColor = colors.white,
  contentPadding = true,
  ignoreSafeAreaTop = false,
  ignoreSafeAreaBottom = false,
  customTopPadding,
  customBottomPadding,
}) => {
  const insets = useSafeAreaInsets();

  // Calculate safe area paddings based on platform and props
  const topPadding = ignoreSafeAreaTop
    ? customTopPadding ?? 0
    : Math.max(insets.top, customTopPadding ?? 0);

  const bottomPadding = ignoreSafeAreaBottom
    ? customBottomPadding ?? 0
    : Math.max(insets.bottom, customBottomPadding ?? 0);

  // Footer height calculation with better platform handling
  const footerHeight = hasFooter
    ? 60 +
      (Platform.OS === "ios"
        ? Math.max(bottomPadding, 10)
        : Math.max(bottomPadding, 16)) // Android typically needs a bit more padding
    : 0;

  const Container = scrollable ? ScrollView : View;

  // Dynamic styles based on platform and safe area insets
  const containerStyle = [
    globalStyles.safeAreaContainer,
    {
      backgroundColor,
      paddingTop: hasHeader ? 0 : topPadding, // Only add top padding if no header
    },
  ];

  return (
    <SafeAreaView style={containerStyle} edges={[]}>
      {/* Header with platform-specific safe area handling */}
      {hasHeader && (
        <View
          style={[
            styles.headerContainer,
            {
              // paddingTop: topPadding,
              // Add extra padding on Android for status bar if needed
              paddingTop:
                Platform.OS === "android"
                  ? Math.max(topPadding, 8)
                  : topPadding,
            },
          ]}
        >
          {headerComponent}
        </View>
      )}

      {/* Main Content Area */}
      <Container
        style={[
          styles.content,
          // Add top padding if no header to account for safe area
          !hasHeader && { paddingTop: Platform.OS === "android" ? 8 : 0 },
        ]}
        contentContainerStyle={
          scrollable
            ? [
                contentPadding && styles.contentPadding,
                {
                  paddingBottom:
                    footerHeight + (Platform.OS === "ios" ? 20 : 24),
                  flexGrow: 1,
                  // Minimum height to ensure content fills screen
                  minHeight: "100%",
                },
              ]
            : [
                { flex: 1 },
                contentPadding && styles.contentPadding,
                {
                  paddingBottom: hasFooter ? footerHeight : bottomPadding,
                },
              ]
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={Platform.OS === "ios"} // Only bounce on iOS
      >
        {children}
      </Container>

      {/* Footer - Fixed at bottom with platform-specific safe area */}
      {hasFooter && (
        <View
          style={[
            styles.footer,
            {
              height: footerHeight,
              paddingBottom: Platform.select({
                ios: Math.max(bottomPadding, 10),
                android: Math.max(bottomPadding, 16),
                default: bottomPadding,
              }),
              // Add left/right safe area padding if device has it (e.g., iPhone X+ landscape)
              paddingLeft: Math.max(insets.left, 0),
              paddingRight: Math.max(insets.right, 0),
            },
          ]}
        >
          {footerComponent}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    zIndex: 10,
  },
  content: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    // Platform-specific shadow styling
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
    // Optional border for better visual separation
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.placeholdergrey || "#e0e0e0",
  },
});

export default PageLayout;
