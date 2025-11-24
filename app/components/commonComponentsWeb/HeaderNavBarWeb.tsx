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
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { categoryService, Category } from "@/services/categoryService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useRoleContext } from "@/context/RoleContext";

type NavItem = {
  label: string;
  onPress?: () => void;
  isDropdown?: boolean; 
};

interface HeaderNavBarProps {
  backgroundColor?: string;
  onCategorySelect?: (category: Category) => void;
  hideNavItems?: boolean;
}

const userNavItems: NavItem[] = [
  {
    label: "Categories",
    isDropdown: true,
  },
  {
    label: "Home",
    onPress: () => redirectToPage(containers.homeScreen),
  },
  {
    label: "Offers",
    onPress: () => redirectToPage(containers.offersScreen),
  },
  {
    label: "Feedback",
    onPress: () => redirectToPage(containers.feedbackScreen),
  },
  {
    label: "Re-order",
    // onPress: () => redirectToPage(containers.reorderScreen),
  },
  {
    label: "Customer Service",
  },
  {
    label: "My Accounts",
  },
];

const HeaderNavBar: React.FC<HeaderNavBarProps> = ({
  backgroundColor = colors.primary, 
  onCategorySelect,
  hideNavItems = false,
}) => {
  const { loading: roleLoading } = useRoleContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = !hideNavItems ? userNavItems : [];

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
    if (item.isDropdown) {
      setShowDropdown((prev) => !prev);
    } else {
      item.onPress?.();
      setShowDropdown(false);
    }
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
    setShowDropdown(false);
  };

  if (roleLoading || hideNavItems) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.emptyBelt} />
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor }]}>
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
                      name={showDropdown ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={colors.white}
                      style={styles.dropdownIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>

              {item.isDropdown && showDropdown && (
                <View style={styles.dropdownMenu}>
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
          ))}
        </View>
      </View>

      {showDropdown && (
        <Pressable
          onPress={() => setShowDropdown(false)}
          style={styles.overlay}
        />
      )}
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
  },
  scrollContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
    flexWrap: "wrap",
  },
  itemWrapper: {
    marginRight: 20,
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
  },
  overlay: {
        position: "fixed",
    inset: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },
});