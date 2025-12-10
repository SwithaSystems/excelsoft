import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/constants/colors";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // Maximum pages to show including ellipsis
    const sidePages = 2; // Pages to show on each side of current page

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let startPage = Math.max(2, currentPage - sidePages);
      let endPage = Math.min(totalPages - 1, currentPage + sidePages);

      // Adjust if we're near the beginning
      if (currentPage <= sidePages + 2) {
        startPage = 2;
        endPage = Math.min(maxVisiblePages - 2, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - sidePages - 1) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 3);
        endPage = totalPages - 1;
      }

      // Add ellipsis before middle section if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle section if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[styles.navButton, currentPage === 1 && styles.disabled]}
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        <Text style={[styles.text, currentPage === 1 && styles.disabledText]}>
          &lt; Previous
        </Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      <View style={styles.pageNumbers}>
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <View key={`ellipsis-${index}`} style={styles.ellipsis}>
                <Text style={styles.ellipsisText}>...</Text>
              </View>
            );
          }

          const isActive = page === currentPage;
          return (
            <TouchableOpacity
              key={page}
              style={[styles.pageButton, isActive && styles.activePage]}
              onPress={() => onPageChange(page as number)}
            >
              <Text style={[styles.pageText, isActive && styles.activeText]}>
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.navButton,
          currentPage === totalPages && styles.disabled,
        ]}
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
      >
        <Text
          style={[
            styles.text,
            currentPage === totalPages && styles.disabledText,
          ]}
        >
          Next &gt;
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    color: colors.black,
  },
  disabledText: {
    color: colors.secondaryText,
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageButton: {
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  activePage: {
    backgroundColor: colors.primary,
    borderColor: colors.borderColorForWeb,
  },
  pageText: {
    color: colors.black,
    fontSize: 14,
  },
  activeText: {
    color: colors.white,
  },
  ellipsis: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  ellipsisText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
});

export default Pagination;
