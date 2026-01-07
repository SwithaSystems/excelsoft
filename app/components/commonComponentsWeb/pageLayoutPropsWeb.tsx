// PageLayoutWeb.tsx
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
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
  const { isAdmin } = useRoleContext();
  const { isWeb } = useWebMediaQuery();

  // Calculate horizontal padding based on viewport width
  // This is a calculation, not a breakpoint decision, so width-based logic is appropriate here
  const horizontalPadding = isWeb ? Math.max(24, Math.min(width * 0.05, 80)) : 24;

  const ContentWrapper = scrollable ? ScrollView : View;

  const headerHeight = 68 + 50; 
  const sidebarWidth = 240;
  
  // Calculate available content height (viewport height minus header)
  const availableHeight = height - (hasHeader ? headerHeight : 0);

  return (
    <View style={[styles.root, { backgroundColor, minHeight: height }]}>
      {/* HEADER */}
      {hasHeader && (
        <View style={styles.headerContainer}>
          <View style={styles.topHeader}>{headerComponent}</View>
          <View style={styles.navbarWrapper}>
            <HeaderNavBar hideNavItems={hideNavItems} />
          </View>
        </View>
      )}

      <View
        style={[
          styles.mainContainer,
          hasHeader && { marginTop: headerHeight },
        ]}
      >
        {hasSidebar && (
          <View style={[styles.sidebar, { width: sidebarWidth }]}>
            {sidebarComponent ? (
              sidebarComponent
            ) : userSidebar ? (
              <UserSidebarWeb />
            ) : isAdmin ? (
              <AdminSidebarWeb />
            ) : (
              <UserSidebarWeb />
            )}
          </View>
        )}

        <ContentWrapper
          style={[
            styles.content,
            { paddingHorizontal: contentPadding ? horizontalPadding : 0 },
          ]}
          contentContainerStyle={scrollable ? [
            styles.scrollContainer,
            { 
              paddingBottom: hasFooter ? 0 : 24,
              minHeight: hasFooter ? availableHeight : undefined,
              flexDirection: hasFooter ? "column" : undefined,
            },
          ] : [
            styles.nonScrollableContainer,
            { paddingBottom: 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {scrollable && hasFooter ? (
            <View style={styles.scrollableContentWrapper}>
              <View style={styles.scrollableChildren}>
                {children}
              </View>
              <View style={styles.footer}>{footerComponent}</View>
            </View>
          ) : scrollable ? (
            <>
              {children}
            </>
          ) : (
            <>
              <View style={styles.contentWrapper}>
                {children}
              </View>
              {hasFooter && <View style={styles.footer}>{footerComponent}</View>}
            </>
          )}
        </ContentWrapper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: "100vh" as unknown as number,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: colors.white,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
  },
  topHeader: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
    zIndex: 10001,
  },
  navbarWrapper: {
    backgroundColor: colors.primary,
    zIndex: 9998,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    backgroundColor: colors.white,
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
  nonScrollableContainer: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 16,
  },
  scrollableContentWrapper: {
    flex: 1,
    flexDirection: "column",
    minHeight: "100%",
  },
  scrollableChildren: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  footer: {
    width: "100%",
    backgroundColor: colors.white,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1,
    paddingVertical: 16,
  },
});

export default PageLayoutWeb;
