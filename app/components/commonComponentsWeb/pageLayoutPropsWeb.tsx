// PageLayoutWeb.tsx
import React from "react";
import { View, ScrollView, StyleSheet, useWindowDimensions, ViewStyle } from "react-native";
import colors from "@/constants/colors";

interface PageLayoutWebProps {
  children: React.ReactNode;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasSidebar?: boolean;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  sidebarComponent?: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  contentPadding?: boolean;
}

export const PageLayoutWeb: React.FC<PageLayoutWebProps> = ({
  children,
  hasHeader = false,
  hasFooter = false,
  hasSidebar = false,
  headerComponent,
  footerComponent,
  sidebarComponent,
  scrollable = true,
  backgroundColor = colors.white,
  contentPadding = true,
}) => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const horizontalPadding = isDesktop ? 64 : isTablet ? 32 : 16;

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <View style={[styles.root, { backgroundColor, minHeight: height }]}>
      {/* Header */}
      {hasHeader && <View style={styles.header}>{headerComponent}</View>}

      <View style={styles.mainContainer}>
        {hasSidebar && (
          <View
            style={[
              styles.sidebar,
              {
                width: isDesktop ? 240 : isTablet ? 200 : 0,
              },
            ]}
          >
            {sidebarComponent}
          </View>
        )}

        <ContentWrapper
          style={[
            styles.content,
            { paddingHorizontal: contentPadding ? horizontalPadding : 0 },
          ]}
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: hasFooter ? 80 : 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ContentWrapper>
      </View>

      {/* Footer */}
      {hasFooter && <View style={styles.footer}>{footerComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: "100vh" as unknown as number, 
  },
  header: {
    width: "100%",
    backgroundColor: colors.white,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    backgroundColor: colors.lightgrey,
    padding: 16,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 16,
  },
  footer: {
    width: "100%",
    backgroundColor: colors.white,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PageLayoutWeb;
