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
}) => {
  const insets = useSafeAreaInsets();

  // Footer height calculation - keep it simple
  const footerHeight = hasFooter
    ? 60 + Math.max(insets.bottom, Platform.OS === "ios" ? 0 : 16)
    : 0;

  // const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView
      style={[globalStyles.safeAreaContainer, { backgroundColor }]}
      edges={["top", "left", "right"]} // Let SafeAreaView handle top, left, right
    >
      {/* Header - No additional padding needed, SafeAreaView handles it */}
      {hasHeader && (
        <View style={styles.headerContainer}>{headerComponent}</View>
      )}

      {/* Content - Explicit component rendering */}
      {scrollable ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            contentPadding && styles.contentPadding,
            {
              paddingBottom: footerHeight + 20,
              flexGrow: 1,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={Platform.OS === "ios"}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.content,
            { flex: 1 },
            contentPadding && styles.contentPadding,
            {
              paddingBottom: footerHeight || Math.max(insets.bottom, 16),
            },
          ]}
        >
          {children}
        </View>
      )}

      {/* Footer - Fixed at bottom */}
      {hasFooter && (
        <View
          style={[
            styles.footer,
            {
              height: footerHeight,
              paddingBottom: Math.max(
                insets.bottom,
                Platform.OS === "ios" ? 10 : 16
              ),
              paddingLeft: insets.left,
              paddingRight: insets.right,
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
  },
});

export default PageLayout;
