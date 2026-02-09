import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
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
    label: "Home",
    onPress: () => redirectToPage(containers.homeScreen),
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

const HeaderNavBar: React.FC<HeaderNavBarProps> = ({
  backgroundColor = colors.primary,
  onCategorySelect,
  hideNavItems = false,
}) => {
  const { loading: roleLoading, isValidUser } = useRoleContext();
  const { logout } = useAuth();
  const userData_redux = useSelector((state: any) => state.user.user);
  const { isMobile } = useWebMediaQuery();

  const isAuthenticated = isValidUser;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await logout();
      setLogOutModalOpen(false);
      router.replace("/modules/home/Home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderAuthButtons = () => {
    if (!isAuthenticated) return null;

    if (isMobile) {
      // Mobile: Show only icons
      return (
        <View style={styles.authButtonsContainerMobile}>
          <TouchableOpacity
            style={styles.authButtonIcon}
            onPress={() => setLogOutModalOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButtonIcon}
            onPress={() => setDeleteAccountModalOpen(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
      );
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

  if (roleLoading || hideNavItems) {
    return (
      <>
        <View style={[styles.container, { backgroundColor }]}>
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
          handleSubmit={() => { }}
          cancelText="No"
          handleCancel={() => setDeleteAccountModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor }]}>
        {isMobile ? (
          // Mobile: Show only Categories dropdown
          categoriesItem && (
            <View style={styles.mobileCategoriesContainer}>
              <TouchableOpacity
                style={styles.mobileCategoriesButton}
                onPress={() => handleNavPress(categoriesItem)}
                activeOpacity={0.7}
              >
                <View style={styles.navItemContent}>
                  <Text style={styles.navText}>{categoriesItem.label}</Text>
                  <Ionicons
                    name={showDropdown === categoriesItem.dropdownType ? "chevron-up" : "chevron-down"}
                    size={18}
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
          )
        ) : (
          // Desktop: Show full navigation
          <View style={styles.scrollContainer}>
            {navItems.map((item, index) => (
              <View key={index} style={styles.itemWrapper}>
                <TouchableOpacity
                  style={styles.navItem}
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
        handleSubmit={() => { }}
        cancelText="No"
        handleCancel={() => setDeleteAccountModalOpen(false)}
      />
    </>
  );
};

export default HeaderNavBar;

const styles = StyleSheet.create({
  container: {
    minHeight: 32,
    justifyContent: "center",
    paddingVertical: 0,
    marginTop: 0,
    overflow: "visible",
    zIndex: 9998,
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
    // flexWrap: "wrap",
    flexGrow: 1,
  },
  itemWrapper: {
    marginRight: 16,
    position: "relative",
    zIndex: 100,
  },
  navItem: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  navText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  dropdownIcon: {
    marginLeft: 4,
    marginTop: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    left: 0,
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    maxHeight: 300,
    zIndex: 9999,
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightgrey,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.black,
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
    paddingHorizontal: 8,
    position: "relative",
    zIndex: 100,
  },
  mobileCategoriesButton: {
    paddingVertical: 8,
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
  },
  authButtonsContainerMobile: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    gap: 4,
    flexShrink: 0,
    marginLeft: "auto",
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  authButtonIcon: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  authButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});