import { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Modal,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "@/constants/colors";
import { categoryService, Category } from "@/services/categoryService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useRoleContext } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { useSelector } from "react-redux";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { AdminSidebarWeb } from "./AdminSidebarWeb";
import { UserSidebarWeb } from "./UserSidebarWeb";
import { UserAPI } from "@/services/userService";
import { showErrorAlert } from "@/utilities/showErrorAlert";
import {
  ACCOUNT_DELETED,
  ACCOUNT_DELETION_ERROR,
} from "@/constants/customErrorMessages";
import { usePathname } from "expo-router";
import SearchBar from "../searchBar";

type NavItem = {
  label: string;
  onPress?: () => void;
  isDropdown?: boolean;
  dropdownType?: 'categories' | 'quicklinks';
  requiresAuth?: boolean;
};

type QuickLinkItem = {
  id: string;
  label: string;
  route: string;
};

interface HeaderNavBarProps {
  backgroundColor?: string;
  onCategorySelect?: (category: Category) => void;
  hideNavItems?: boolean;
  hasSidebar?: boolean;
}

const quickLinks: QuickLinkItem[] = [
  { id: "orders", label: "Your Orders", route: containers.myOrderScreen },
  { id: "saved-items", label: "Saved Items", route: containers.savedItemScreen },
  { id: "saved-address", label: "Saved Address", route: containers.savedAddressScreen },
];

const allNavItems: NavItem[] = [
  {
    label: "Categories",
    isDropdown: true,
    dropdownType: 'categories',
    requiresAuth: false,
  },
  {
    label: "Quick Links",
    isDropdown: true,
    dropdownType: 'quicklinks',
    requiresAuth: true,
  },
  // {
  //   label: "Feedback",
  //   onPress: () => redirectToPage(containers.feedbackScreen),
  //   requiresAuth: false,
  // },
  {
    label: "Customer Service",
    onPress: () => redirectToPage(containers.customerSupportScreen),
    requiresAuth: false,
  },
  // {
  //   label: "My Accounts",
  //   onPress: () => redirectToPage(containers.editProfileScreen),
  //   requiresAuth: true,
  // },
];

const HeaderNavBar: FC<HeaderNavBarProps> = ({
  backgroundColor = colors.primary,
  onCategorySelect,
  hideNavItems = false,
  hasSidebar: _hasSidebar = false,
}) => {
  const { loading: roleLoading, isValidUser, isAdmin } = useRoleContext();
  const { logout } = useAuth();
  const userData_redux = useSelector((state: any) => state.user.user);
  const { isMobile } = useWebMediaQuery();
  const { width } = useWindowDimensions();

  const isAuthenticated = isValidUser;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [hoveredNavLabel, setHoveredNavLabel] = useState<string | null>(null);
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [showSidebarDrawer, setShowSidebarDrawer] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  // Animation values for drawer - use pixel values
  const drawerWidth = Math.min(width * 0.8, 320);
  const drawerTranslateX = useSharedValue(-drawerWidth);
  const overlayOpacity = useSharedValue(0);

  const pathname = usePathname();

  // Detect screen type from route
  const isAdminScreen = pathname.includes("/admin/");


  const navItems = !hideNavItems 
    ? allNavItems.filter(item => !item.requiresAuth || isAuthenticated)
    : [];

  useEffect(() => {
    if (hideNavItems || roleLoading) {
      return;
    }

    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        const sorted = Array.isArray(data)
          ? data.sort((a, b) =>
              a.name === "All" ? -1 : (a?.id ?? 0) - (b?.id ?? 0)
            )
          : [];
        setCategories(sorted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [hideNavItems, roleLoading]);

  // Handle drawer open/close with animation
  useEffect(() => {
    if (showSidebarDrawer) {
      drawerTranslateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      overlayOpacity.value = withTiming(0.5, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    } else {
      drawerTranslateX.value = withTiming(-drawerWidth, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      overlayOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [showSidebarDrawer, drawerTranslateX, overlayOpacity, drawerWidth]);

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drawerTranslateX.value }],
    };
  }, []);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const handleDrawerClose = () => {
    setShowSidebarDrawer(false);
  };

  const handleNavPress = (item: NavItem) => {
    if (item.isDropdown && item.dropdownType) {
      setShowDropdown((prev) => prev === item.dropdownType ? null : item.dropdownType ?? null);
    } else {
      item.onPress?.();
      setShowDropdown(null);
    }
  };

  const handleQuickLinkPress = (item: QuickLinkItem) => {
    if (item.id === "orders") {
      redirectToPage(item.route, {
        userId: userData_redux?._id || userData_redux?.id,
      });
    } else {
      redirectToPage(item.route);
    }
    setShowDropdown(null);
  };

  const handleCategoryPress = (cat: Category) => {
    onCategorySelect?.(cat);
    if (cat.name === "All") {
      redirectToPage(containers.categoriesScreen, {
        category: cat.name,
        categoryId: cat.id,
      });
    } else {
      redirectToPage(containers.searchResultsScreen, {
        fromSearch: true,
        category: cat.name,
        categoryId: cat.id,
      });
    }
    setShowDropdown(null);
  };

  const handleMobileSearchSubmit = () => {
    setShowDropdown(null);
    const q = (mobileSearchQuery || "").trim();
    redirectToPage(containers.searchResultsScreen, q ? { query: q } : {});
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLogOutModalOpen(false);
      router.replace("/modules/home/Home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSoftDelete = async () => {
    // Get user ID from redux state
    const userId = userData_redux?._id || userData_redux?.id;
    
    if (!userId) {
      if (Platform.OS === 'web') {
        alert("Error: User ID not found. Please try again.");
      } else {
        showErrorAlert({
          title: "Error",
          message: "User ID not found. Please try again.",
        });
      }
      return;
    }

    try {
      setDeleteAccountModalOpen(false); // Close modal first
      
      const response = await UserAPI.softDeleteUser(userId);
      
      if (response) {
        // Show success message
        if (Platform.OS === 'web') {
          alert(ACCOUNT_DELETED || "Your account has been deleted successfully.");
          // Logout and redirect immediately after alert is dismissed
          await logout();
          router.replace("/modules/home/Home");
        } else {
          showErrorAlert({
            title: "Account Deleted",
            message: ACCOUNT_DELETED || "Your account has been deleted successfully.",
          });
          // Logout and redirect after a short delay for mobile
          setTimeout(async () => {
            await logout();
            router.replace("/modules/home/Home");
          }, 1500);
        }
      }
    } catch (error: any) {
      // console.error("Deletion error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        ACCOUNT_DELETION_ERROR ||
        "Failed to delete account. Please try again.";
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        showErrorAlert({
          title: "Deletion Failed",
          message,
        });
      }
    }
  };

  const renderAuthButtons = () => {
    if (!isAuthenticated) return null;

    // Mobile: do not show auth buttons in the green bar (they are in the drawer)
    if (isMobile) {
      return null;
    }

    // Desktop: Show icons with text
    return (
      <View style={styles.authButtonsContainer}>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => setLogOutModalOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={styles.authButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => setDeleteAccountModalOpen(true)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="delete" size={20} color={colors.white} />
          <Text style={styles.authButtonText}>Close Account</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Get only Categories item for mobile
  const categoriesItem = navItems.find(item => item.dropdownType === 'categories');
  const quickLinksItem = navItems.find(item => item.dropdownType === 'quicklinks');

  if (roleLoading || hideNavItems) {
    return (
      <>
        <View style={[styles.container, { backgroundColor }]}>
          {/* Menu button - Always show on mobile when authenticated */}
          {isMobile && isAuthenticated && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowSidebarDrawer(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color={colors.white} />
            </TouchableOpacity>
          )}
          {!isMobile && <View style={styles.emptyBelt} />}
          {renderAuthButtons()}
        </View>
        <ConfirmationModal
          onClose={() => setLogOutModalOpen(false)}
          isModalVisible={logOutModalOpen}
          text="Are you sure you want to Log out?"
          title="Log out"
          submitText="Yes"
          handleSubmit={handleLogout}
          cancelText="No"
          handleCancel={() => setLogOutModalOpen(false)}
        />
        <ConfirmationModal
          onClose={() => setDeleteAccountModalOpen(false)}
          isModalVisible={deleteAccountModalOpen}
          title="Delete Account"
          text="Are you sure you want to delete your account? This action cannot be undone."
          submitText="Yes"
          handleSubmit={handleSoftDelete}
          cancelText="No"
          handleCancel={() => setDeleteAccountModalOpen(false)}
          isDestructive={true}
        />
        {/* Sidebar Drawer (Mobile Only) - Always available when authenticated */}
        {isMobile && isAuthenticated && (
          <Modal
            visible={showSidebarDrawer}
            transparent={true}
            animationType="none"
            onRequestClose={handleDrawerClose}
          >
            <View style={styles.drawerContainer}>
              {/* Overlay */}
              <Animated.View
                style={[styles.drawerOverlay, overlayAnimatedStyle]}
              >
                <Pressable
                  style={styles.overlayPressable}
                  onPress={handleDrawerClose}
                />
              </Animated.View>

              {/* Drawer */}
              <Animated.View
                style={[
                  styles.drawer,
                  drawerAnimatedStyle,
                  isAdmin ? styles.drawerAdmin : styles.drawerUser,
                ]}
              >
                {/* Close Button */}
                <View style={styles.drawerHeader}>
                  <TouchableOpacity
                    style={styles.drawerCloseButton}
                    onPress={handleDrawerClose}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={28} color={colors.black} />
                  </TouchableOpacity>
                </View>

                {/* Sidebar Content */}
                {isAdminScreen ? (
                  <ScrollView
                    style={styles.drawerContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <AdminSidebarWeb isDrawer={true} onClose={handleDrawerClose} />
                  </ScrollView>
                ) : (
                  <View style={styles.drawerContent}>
                    <UserSidebarWeb
                      isDrawer={true}
                      onClose={handleDrawerClose}
                      onLogout={() => setLogOutModalOpen(true)}
                      onDeleteAccount={() => setDeleteAccountModalOpen(true)}
                    />
                  </View>
                )}
              </Animated.View>
            </View>
          </Modal>
        )}
      </>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor }]}>
        {isMobile ? (
          // Mobile: Show menu button, Categories dropdown and auth buttons
          <>
            {/* Menu button - Always show on mobile when authenticated */}
            {isAuthenticated && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setShowSidebarDrawer(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="menu" size={24} color={colors.white} />
              </TouchableOpacity>
            )}
            {categoriesItem && (
              <View style={styles.mobileCategoriesContainer}>
                <TouchableOpacity
                  style={styles.mobileCategoriesButton}
                  onPress={() => handleNavPress(categoriesItem)}
                  activeOpacity={0.7}
                >
                  <View style={styles.navItemContent}>
                    <Text style={[styles.navText, styles.mobileNavText]}>{categoriesItem.label}</Text>
                    <Ionicons
                      name={showDropdown === categoriesItem.dropdownType ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={colors.white}
                      style={styles.dropdownIcon}
                    />
                  </View>
                </TouchableOpacity>
                {showDropdown === categoriesItem.dropdownType && (
                  <View style={styles.mobileDropdownMenu}>
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator color={colors.primary} />
                      </View>
                    ) : (
                      <ScrollView
                        style={styles.dropdownScroll}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                      >
                        {categories.map((cat) => (
                          <TouchableOpacity
                            key={String(cat.id ?? cat.name)}
                            onPress={() => handleCategoryPress(cat)}
                            style={styles.dropdownItem}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.dropdownText}>{cat.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Quick Links dropdown (mobile web, user-side screens only) */}
            {!isAdminScreen && quickLinksItem && (
              <View style={styles.mobileQuickLinksContainer}>
                <TouchableOpacity
                  style={styles.mobileCategoriesButton}
                  onPress={() => handleNavPress(quickLinksItem)}
                  activeOpacity={0.7}
                >
                  <View style={styles.navItemContent}>
                    <Text style={[styles.navText, styles.mobileNavText]}>{quickLinksItem.label}</Text>
                    <Ionicons
                      name={showDropdown === quickLinksItem.dropdownType ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={colors.white}
                      style={styles.dropdownIcon}
                    />
                  </View>
                </TouchableOpacity>
                {showDropdown === quickLinksItem.dropdownType && (
                  <View style={styles.mobileDropdownMenu}>
                    <View>
                      {quickLinks.map((link) => (
                        <TouchableOpacity
                          key={link.id}
                          onPress={() => handleQuickLinkPress(link)}
                          style={styles.dropdownItem}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.dropdownText}>{link.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Inline SearchBar: search globally from nav (go to results, not search page) */}
            <View style={styles.mobileSearchWrapper}>
              <SearchBar
                placeholder="Search..."
                value={mobileSearchQuery}
                onChangeText={setMobileSearchQuery}
                onPress={handleMobileSearchSubmit}
                onSubmitEditing={handleMobileSearchSubmit}
                height={32}
              />
            </View>
          </>
        ) : (
          // Desktop: Show full navigation
          <View style={styles.scrollContainer}>
            {navItems.map((item, index) => (
              <View
                key={index}
                style={styles.itemWrapper}
                onPointerEnter={() => !isMobile && setHoveredNavLabel(item.label)}
                onPointerLeave={() => !isMobile && setHoveredNavLabel(null)}
              >
                <TouchableOpacity
                  style={[
                    styles.navItem,
                    !isMobile && hoveredNavLabel === item.label && styles.navItemHovered,
                  ]}
                  onPress={() => handleNavPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.navItemContent}>
                    <Text style={styles.navText}>{item.label}</Text>
                    {item.isDropdown && (
                      <Ionicons
                        name={showDropdown === item.dropdownType ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={colors.white}
                        style={styles.dropdownIcon}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {item.isDropdown && showDropdown === item.dropdownType && (
                  <View style={styles.dropdownMenu}>
                    {item.dropdownType === 'categories' ? (
                      loading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator color={colors.primary} />
                        </View>
                      ) : (
                        <ScrollView
                          style={styles.dropdownScroll}
                          nestedScrollEnabled
                          showsVerticalScrollIndicator
                        >
                          {categories.map((cat) => (
                            <TouchableOpacity
                              key={String(cat.id ?? cat.name)}
                              onPress={() => handleCategoryPress(cat)}
                              style={styles.dropdownItem}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.dropdownText}>{cat.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )
                    ) : item.dropdownType === 'quicklinks' ? (
                      <View>
                        {quickLinks.map((link) => (
                          <TouchableOpacity
                            key={link.id}
                            onPress={() => handleQuickLinkPress(link)}
                            style={styles.dropdownItem}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.dropdownText}>{link.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : null}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        {renderAuthButtons()}
      </View>
      {showDropdown && (
        <Pressable
          onPress={() => setShowDropdown(null)}
          style={styles.overlay}
        />
      )}
      <ConfirmationModal
        onClose={() => setLogOutModalOpen(false)}
        isModalVisible={logOutModalOpen}
        text="Are you sure you want to Log out?"
        title="Log out"
        submitText="Yes"
        handleSubmit={handleLogout}
        cancelText="No"
        handleCancel={() => setLogOutModalOpen(false)}
      />
      <ConfirmationModal
        onClose={() => setDeleteAccountModalOpen(false)}
        isModalVisible={deleteAccountModalOpen}
        title="Delete Account"
        text="Are you sure you want to delete your account? This action cannot be undone."
        submitText="Yes"
        handleSubmit={handleSoftDelete}
        cancelText="No"
        handleCancel={() => setDeleteAccountModalOpen(false)}
        isDestructive={true}
      />

      {/* Sidebar Drawer (Mobile Only) - Always available when authenticated */}
      {isMobile && isAuthenticated && (
        <Modal
          visible={showSidebarDrawer}
          transparent={true}
          animationType="none"
          onRequestClose={handleDrawerClose}
        >
          <View style={styles.drawerContainer}>
            {/* Overlay */}
            <Animated.View
              style={[styles.drawerOverlay, overlayAnimatedStyle]}
            >
              <Pressable
                style={styles.overlayPressable}
                onPress={handleDrawerClose}
              />
            </Animated.View>

            {/* Drawer */}
            <Animated.View
              style={[
                styles.drawer,
                drawerAnimatedStyle,
                isAdmin ? styles.drawerAdmin : styles.drawerUser,
              ]}
            >
              {/* Close Button */}
              <View style={styles.drawerHeader}>
                <TouchableOpacity
                  style={styles.drawerCloseButton}
                  onPress={handleDrawerClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={28} color={colors.black} />
                </TouchableOpacity>
              </View>

              {/* Sidebar Content */}
              {isAdminScreen ? (
                <ScrollView
                  style={styles.drawerContent}
                  showsVerticalScrollIndicator={false}
                >
                  <AdminSidebarWeb isDrawer={true} onClose={handleDrawerClose} />
                </ScrollView>
              ) : (
                <View style={styles.drawerContent}>
                  <UserSidebarWeb
                    isDrawer={true}
                    onClose={handleDrawerClose}
                    onLogout={() => setLogOutModalOpen(true)}
                    onDeleteAccount={() => setDeleteAccountModalOpen(true)}
                  />
                </View>
              )}
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default HeaderNavBar;

const styles = StyleSheet.create({
  container: {
    minHeight: 36,
    justifyContent: "space-between",
    paddingVertical: 0,
    marginTop: 0,
    overflow: "visible",
    zIndex: 9998,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  scrollContainer: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    paddingTop: 6,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0, // Allow flexbox to shrink below content size
  },
  itemWrapper: {
    marginRight: 6,
    position: "relative",
    zIndex: 100,
    borderRadius: 8,
  },
  navItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navItemHovered: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  navItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  navText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  dropdownIcon: {
    marginLeft: 5,
    marginTop: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 44,
    left: 0,
    width: 220,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    maxHeight: 320,
    zIndex: 9999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  dropdownScroll: {
    maxHeight: 320,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightgrey,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: "500",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBelt: {
    height: 40,
    flex: 1,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  mobileCategoriesContainer: {
    paddingHorizontal: 4,
    position: "relative",
    zIndex: 100,
    flexShrink: 1,
    flexGrow: 0,
  },
  mobileQuickLinksContainer: {
    paddingHorizontal: 8,
    position: "relative",
    zIndex: 100,
    flexShrink: 1,
    flexGrow: 0,
  },
  mobileSearchWrapper: {
    flex: 1,
    marginLeft: 6,
    marginRight: 12,
    maxWidth: 160,
  },
  mobileNavText: {
    fontSize: 13,
  },
  mobileCategoriesButton: {
    paddingVertical: 6,
  },
  mobileDropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    maxWidth: 300,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    maxHeight: 400,
    zIndex: 9999,
    overflow: "hidden",
    marginTop: 4,
  },
  authButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    gap: 12,
    flexShrink: 0,
    flexGrow: 0,
    marginLeft: "auto", // Push buttons to the right
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  authButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerContainer: {
    flex: 1,
    position: "relative",
  },
  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10000,
  },
  overlayPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "80%",
    maxWidth: 320,
    backgroundColor: colors.white,
    zIndex: 10001,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 0 },
    elevation: 10,
  },
  drawerAdmin: {
    width: "80%",
    maxWidth: 320,
  },
  drawerUser: {
    width: "80%",
    maxWidth: 320,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  drawerCloseButton: {
    padding: 4,
  },
  drawerContent: {
    flex: 1,
  },
});