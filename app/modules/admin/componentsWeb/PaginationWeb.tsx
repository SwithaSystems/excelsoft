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
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;
          return (
            <TouchableOpacity
              key={page}
              style={[styles.pageButton, isActive && styles.activePage]}
              onPress={() => onPageChange(page)}
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
});

export default Pagination;
