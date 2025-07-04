import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { PageLayout } from "../pageLayoutProps";
import Header from "@/components/Header";
import { ADMIN_ACCESS_CONTROL_SCREEN_TITLE } from "../config/stringLiterals";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../config/colors";
import { UserAPI } from "@/services/userService";

const AdminAccessControlScreen = () => {
  const [accessList, setAccessList] = useState<boolean[]>([]);
  const [searchText, setSearchText] = useState("");
  const [allUsersData, setAllUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingAccess, setUpdatingAccess] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);

  const toggleAccess = async (index: number, userId: string) => {
    try {
      setUpdatingAccess(index);
      const newAccessList = [...accessList];
      const newAccessValue = !newAccessList[index];

      // Optimistically update UI
      newAccessList[index] = newAccessValue;
      setAccessList(newAccessList);

      // Make API call to update user access
      // await UserAPI.updateUserAccess(userId, newAccessValue);

      Alert.alert(
        "Access Updated",
        `User access has been ${
          newAccessValue ? "granted" : "revoked"
        } successfully.`
      );
    } catch (error) {
      console.error("Error updating access:", error);
      // Revert the change if API call fails
      const revertedList = [...accessList];
      revertedList[index] = !revertedList[index];
      setAccessList(revertedList);

      Alert.alert("Error", "Failed to update user access. Please try again.");
    } finally {
      setUpdatingAccess(null);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.getAllUsers();
      console.log("response in userProfilescreen", response?.data);

      const simplifiedUsers = response.data.map((user: any) => ({
        id: user?.id || user?._id,
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        phone: user?.phone || "N/A",
        email: user?.email || "N/A",
        isAdmin: user?.isAdmin || false,
      }));

      setAllUsersData(simplifiedUsers);
      setAccessList(simplifiedUsers.map((user: any) => user.isAdmin));
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  // Filter users based on search text
  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) {
      return allUsersData;
    }
    return allUsersData.filter(
      (user: any) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phone.includes(searchText)
    );
  }, [allUsersData, searchText]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderUserItem = ({ item, index }: any) => {
    const actualIndex = allUsersData.findIndex(
      (user: any) => user._id === item._id
    );

    return (
      <View style={styles.userRow}>
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.name || "Unknown User"}
            </Text>
            {item.isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
          <Text style={styles.phoneText} numberOfLines={1}>
            {item.phone}
          </Text>
          <Text style={styles.emailText} numberOfLines={1}>
            {item.email}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.accessToggle,
            accessList[actualIndex] && styles.accessToggleActive,
          ]}
          onPress={() => toggleAccess(actualIndex, item.id)}
          disabled={updatingAccess === actualIndex}
        >
          {updatingAccess === actualIndex ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              {accessList[actualIndex] && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>
        Users ({filteredUsers.length})
        {filteredUsers.length > usersPerPage && (
          <Text style={styles.pageInfo}>
            {" "}
            • Page {currentPage} of {totalPages}
          </Text>
        )}
      </Text>
      <Text style={styles.headerText}>Admin Access</Text>
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}{" "}
            of {filteredUsers.length}
          </Text>
        </View>

        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === 1 && styles.pageButtonDisabled,
            ]}
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={currentPage === 1 ? colors.lightgrey : colors.primary}
            />
          </TouchableOpacity>

          {startPage > 1 && (
            <>
              <TouchableOpacity
                style={styles.pageNumberButton}
                onPress={() => goToPage(1)}
              >
                <Text style={styles.pageNumberText}>1</Text>
              </TouchableOpacity>
              {startPage > 2 && <Text style={styles.ellipsis}>...</Text>}
            </>
          )}

          {pageNumbers.map((pageNum) => (
            <TouchableOpacity
              key={pageNum}
              style={[
                styles.pageNumberButton,
                currentPage === pageNum && styles.pageNumberButtonActive,
              ]}
              onPress={() => goToPage(pageNum)}
            >
              <Text
                style={[
                  styles.pageNumberText,
                  currentPage === pageNum && styles.pageNumberTextActive,
                ]}
              >
                {pageNum}
              </Text>
            </TouchableOpacity>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <Text style={styles.ellipsis}>...</Text>
              )}
              <TouchableOpacity
                style={styles.pageNumberButton}
                onPress={() => goToPage(totalPages)}
              >
                <Text style={styles.pageNumberText}>{totalPages}</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.pageButtonDisabled,
            ]}
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={
                currentPage === totalPages ? colors.lightgrey : colors.primary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={colors.lightgrey} />
      <Text style={styles.emptyStateText}>
        {searchText
          ? "No users found matching your search"
          : "No users available"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <PageLayout
        hasHeader
        hasFooter={false}
        scrollable={false}
        headerComponent={
          <Header headerText={ADMIN_ACCESS_CONTROL_SCREEN_TITLE} />
        }
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      hasHeader
      hasFooter={false}
      scrollable={false}
      headerComponent={
        <Header headerText={ADMIN_ACCESS_CONTROL_SCREEN_TITLE} />
      }
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.primary} />
            <TextInput
              placeholder="Search by name, email, or phone..."
              placeholderTextColor={colors.placeholdergrey}
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText ? (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                style={styles.clearButton}
              >
                <Ionicons name="close" size={20} color={colors.slateGrey} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Users List */}
        <View style={styles.listContainer}>
          <FlatList
            data={currentUsers}
            keyExtractor={(item: any) =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={renderUserItem}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              currentUsers.length === 0 ? styles.emptyListContainer : null
            }
          />
        </View>

        {/* Pagination */}
        {renderPagination()}
      </View>
    </PageLayout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.darkGray,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  pageInfo: {
    fontSize: 12,
    fontWeight: "400",
    color: "#666",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "white",
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  adminBadge: {
    backgroundColor: colors.primary || "#007bff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  phoneText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  emailText: {
    fontSize: 14,
    color: "#666",
  },
  accessToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  accessToggleActive: {
    backgroundColor: colors.primary || "#007bff",
    borderColor: colors.primary || "#007bff",
  },
  paginationContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  paginationInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 14,
    color: "#666",
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageNumberButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 8,
  },
  pageNumberButtonActive: {
    backgroundColor: colors.primary || "#007bff",
    borderColor: colors.primary || "#007bff",
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  pageNumberTextActive: {
    color: "white",
  },
  ellipsis: {
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 4,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  showMoreText: {
    fontSize: 16,
    color: colors.primary || "#007bff",
    fontWeight: "600",
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.Gray88 || "#666",
    textAlign: "center",
    marginTop: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
});

export default AdminAccessControlScreen;
