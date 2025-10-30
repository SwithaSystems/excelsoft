// PageLayoutWeb.tsx
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import colors from "@/constants/colors";
import HeaderNavBar from "./HeaderNavBarWeb";
import { AdminSidebarWeb } from "./AdminSidebarWeb";
import { UserSidebarWeb } from "./UserSidebarWeb";
import { useRoleContext } from "@/context/RoleContext";

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
}) => {
  const { width, height } = useWindowDimensions();
  const { isAdmin, loading } = useRoleContext();
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const horizontalPadding = isDesktop ? 64 : isTablet ? 32 : 16;
  const ContentWrapper = scrollable ? ScrollView : View;

  const headerHeight = isDesktop ? 68 + 50 : isTablet ? 56 + 50 : 52 + 50;
  const navBarHeight = 50;
  const totalHeaderHeight = headerHeight + navBarHeight;
console.log({isAdmin})

  return (
    <View style={[styles.root, { backgroundColor, minHeight: height }]}>
      {/* HEADER */}
      {hasHeader && (
        <View style={[styles.headerContainer, Platform.OS === "web" && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          overflow: "visible",
        }]}>
          <View style={styles.topHeader}>{headerComponent}</View>

          <View style={styles.navbarWrapper}>
            <HeaderNavBar hideNavItems={hideNavItems}/>
          </View>
        </View>
      )}

      <View
        style={[
          styles.mainContainer,
          hasHeader && { marginTop: Platform.OS === "web" ? headerHeight : totalHeaderHeight },
        ]}
      >
        {hasSidebar && (
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
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: hasFooter ? 80 : 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ContentWrapper>
      </View>

      {/* FOOTER */}
      {hasFooter && (
        <View style={styles.footer}>
          {footerComponent}
        </View>
      )}
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
    zIndex: 10000,
    overflow: "visible",
  },
  topHeader: {
    width: "100%",
    backgroundColor: colors.white,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
  },
  navbarWrapper: {
    width: "100%",
    backgroundColor: colors.primary,
    overflow: "visible",
    zIndex: 10000,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
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
    paddingTop: 16,
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
