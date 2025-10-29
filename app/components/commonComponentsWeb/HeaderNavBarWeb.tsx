import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
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

const adminNavItems: NavItem[] = [];

const HeaderNavBar: React.FC<HeaderNavBarProps> = ({
  backgroundColor = colors.primary, 
  onCategorySelect,
}) => {
  const {isAdmin} = useRoleContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = isAdmin ? adminNavItems : userNavItems;

  useEffect(() => {
    const hasDropdown = navItems.some((item) => item.isDropdown);
    if (!hasDropdown) return;

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
  }, [navItems]);

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
    setShowDropdown(false);
  };

  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {navItems.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {navItems.map((item, index) => (
            <View key={index} style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => handleNavPress(item)}
              >
                <Text style={styles.navText}>{item.label}</Text>
              </TouchableOpacity>

              {item.isDropdown && showDropdown && (
                <View style={styles.dropdownMenu}>
                  {loading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <FlatList
                      data={categories}
                      keyExtractor={(cat) => String(cat.id ?? cat.name)}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleCategoryPress(item)}
                          style={styles.dropdownItem}
                        >
                          <Text style={styles.dropdownText}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyBelt} />
      )}
    </View>
  );
};

export default HeaderNavBar;

const styles = StyleSheet.create({
  container: {
    minHeight: 32, 
    justifyContent: "center",
    paddingVertical: 0,
    marginTop: 0,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  itemWrapper: {
    marginRight: 20,
    position: "relative",
  },
  navItem: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  dropdownMenu: {
    position: "absolute",
    top: 35,
    left: 0,
    width: 180,
    backgroundColor: colors.white,
    borderRadius: 6,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    maxHeight: 250,
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightgrey,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.black,
  },
  emptyBelt: {
    height: 40,
  },
});