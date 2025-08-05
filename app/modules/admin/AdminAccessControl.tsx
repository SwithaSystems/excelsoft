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
// import { PageLayout } from "@/app/components/commonComponents/pageLayoutProps";
import Header from "../../components/Header";
import { ADMIN_ACCESS_CONTROL_SCREEN_TITLE } from "../../../constants/stringLiterals";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../../../constants/colors";
import { UserAPI } from "@/services/userService";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import styles from "./AdminAccessControlStyles";

const AdminAccessControlScreen = () => {
  const [accessList, setAccessList] = useState<boolean[]>([]);
  const [searchText, setSearchText] = useState("");
  const [allUsersData, setAllUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingAccess, setUpdatingAccess] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const toggleAccess = async (index: number, userId: string) => {
    try {
      setUpdatingAccess(index);
      const newAccessList = [...accessList];
      const newAccessValue = !newAccessList[index];

      // Optimistically update UI
      newAccessList[index] = newAccessValue;
      setAccessList(newAccessList);

      console.log("userID and new accessValue", userId, newAccessValue);
      // Make API call to update user access
      const response = await UserAPI.updateUserAccess(userId, newAccessValue);
      console.log("response in toggleAccess", response.data);

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
        _id: user?._id,
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        phone: user?.phone,
        email: user?.email,
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
    return allUsersData.filter((user: any) => {
      const searchLower = searchText.toLowerCase();
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const phone = String(user.phone || "");

      return (
        name.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchText)
      );
    });
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
          onPress={() => toggleAccess(actualIndex, item._id)}
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
              textSecondary={colors.placeholdergrey}
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

export default AdminAccessControlScreen;
