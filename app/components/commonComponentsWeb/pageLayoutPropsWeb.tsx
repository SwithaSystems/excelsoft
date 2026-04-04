// PageLayoutWeb.tsx
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
  type DimensionValue,
} from "react-native";
import colors from "@/constants/colors";
import HeaderNavBar from "./HeaderNavBarWeb";
import { AdminSidebarWeb } from "./AdminSidebarWeb";
import { UserSidebarWeb } from "./UserSidebarWeb";
import { useRoleContext } from "@/context/RoleContext";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

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
  hideNavItems?: boolean; 
  userSidebar?: boolean;
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
  hideNavItems = false,
  userSidebar = false,
}) => {
  const { width, height } = useWindowDimensions();
  const { isAdmin, loading } = useRoleContext();
  const { isMobile, isTablet, isDesktop } = useWebMediaQuery();

  // Responsive padding based on media queries
  const horizontalPadding =
  isDesktop ? 64 :
  isTablet ? 32 :
  isMobile ? 10 : 16;
  const ContentWrapper = scrollable ? ScrollView : View;

  // Responsive header heights
  const navBarHeight = isMobile ? 32 : 54;

  const headerHeight = isDesktop
    ? 72 + 54
    : isTablet
    ? 60 + 54
    : 52; 
    
  const totalHeaderHeight = isMobile
    ? headerHeight + navBarHeight
    : headerHeight + navBarHeight;

  
  // Use fixed positioning for desktop/tablet, relative for mobile browsers
  // Mobile browsers handle fixed positioning poorly, so use relative positioning
  const shouldUseFixedHeader = !isMobile;

  return (
    <View style={[
      styles.root,
      { backgroundColor },
      Platform.OS === "web" && hasFooter && isMobile && styles.rootWithFooterMobile,
    ]}>
      {/* HEADER */}
      {hasHeader && (
        <View style={[
          styles.headerContainer,
          shouldUseFixedHeader && styles.headerContainerFixed,
          isMobile && styles.headerContainerMobile,
        ]}>
          <View style={styles.topHeader}>{headerComponent}</View>

          <View style={styles.navbarWrapper}>
            <HeaderNavBar hideNavItems={hideNavItems} hasSidebar={hasSidebar}/>
          </View>
        </View>
      )}

      <View
        style={[
          styles.mainContainer,
          hasHeader && shouldUseFixedHeader && {
            marginTop: headerHeight,
          },
          isMobile && { marginTop: 6 },
        ]}
      >
        {/* Sidebar - Only render on tablet/desktop, hidden on mobile (accessible via menu button drawer) */}
        {hasSidebar && !isMobile && (
          <View
            style={[
              styles.sidebar,
              {
                width: isDesktop ? 240 : isTablet ? 200 : 0,
              },
            ]}
          >
        {sidebarComponent ? (
          sidebarComponent
        ) : userSidebar ? (
          <UserSidebarWeb />
        ) : (
          <AdminSidebarWeb />
        )}
          </View>
        )}

        <ContentWrapper
          style={[
            styles.content,
            { 
              paddingHorizontal: contentPadding ? horizontalPadding : 0,
              paddingBottom: 0,
              paddingTop: contentPadding && (isTablet || isDesktop) ? 24 : 0,
            },
          ]}
          {...(scrollable && {
            contentContainerStyle: [
              styles.scrollContainer,
              {
                paddingBottom: hasFooter ? (isMobile ? 40 : 24) : 24,
              },
            ],
          })}
          showsVerticalScrollIndicator={scrollable ? false : undefined}
        >
          {children}
        </ContentWrapper>
      </View>

      {/* FOOTER */}
      {hasFooter && (
        <View style={[
          styles.footer,
          isMobile && styles.footerMobile,
        ]}>
          {footerComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: Platform.OS === "web" ? "100%" : undefined,
  },
  rootWithFooterMobile: {
    // Mobile web: ensure root has viewport height so flex layout works and footer stays below scroll
    minHeight: "100vh" as DimensionValue,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: colors.white,
    zIndex: 10000,
    overflow: "visible",
  },
  headerContainerFixed: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
  },
  headerContainerMobile: {
    position: "relative",
    // Use relative positioning on mobile browsers to avoid viewport issues
    // Fixed positioning can cause layout problems with mobile browser UI (address bar, etc.)
  },
  topHeader: {
    width: "100%",
    backgroundColor: colors.white,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
    position: "relative",
    zIndex: 10001, // Higher than navbarWrapper to allow dropdown to appear above
    overflow: "visible",
  },
  navbarWrapper: {
    width: "100%",
    backgroundColor: colors.primary,
    overflow: "visible",
     zIndex: 9998,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
 mainContainer: {
    flex: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    minHeight: 0, // Allow flex item to shrink so footer stays visible when hasFooter
  },
  sidebar: {
    backgroundColor: colors.white,
    padding: 16,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    // paddingTop: 16,
  },
  footer: {
    width: "100%",
    backgroundColor: colors.white,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1,
    paddingVertical: 16,
  },
  footerMobile: {
    paddingTop: 6,
    paddingBottom: 12,
    position: "relative",
  },
});

export default PageLayoutWeb;
