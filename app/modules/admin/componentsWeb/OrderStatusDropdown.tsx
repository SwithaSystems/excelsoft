import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import colors from "../../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface OrderStatusDropdownProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  containerStyle?: any;
  isMobileWeb?: boolean;
}

const statusOptions = ["All Orders", "Cancelled", "Replaced", "Returned"];

const OrderStatusDropdown = ({
  selectedStatus,
  onSelectStatus,
  containerStyle,
  isMobileWeb = false,
}: OrderStatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (status: string) => {
    onSelectStatus(status);
    setIsOpen(false);
  };

  const renderStatusItems = () => (
    <>
      {statusOptions.map((status) => (
        <TouchableOpacity
          key={status}
          style={styles.dropdownItem}
          onPress={() => handleSelect(status)}
        >
          <Text style={styles.dropdownItemText}>{status}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  return (
    <View
        style={[
          styles.categoryContainer,
          isMobileWeb && styles.categoryContainerMobileWeb, 
          containerStyle,
        ]}
      >
      <TouchableOpacity
        onPress={() => setIsOpen((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.categorySelector}>
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  selectedStatus && selectedStatus !== ""
                    ? colors.black
                    : colors.slateGrey,
              },
            ]}
          >
            {selectedStatus || "All Orders"}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.black}
          />
        </View>
      </TouchableOpacity>
      {isOpen && (
        Platform.OS === "web" ? (
          // ===== WEB: inline dropdown =====
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScrollArea}>
              {renderStatusItems()}
            </ScrollView>
          </View>
        ) : (
          // ===== MOBILE: modal dropdown =====
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => setIsOpen(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setIsOpen(false)}
            >
              <View style={styles.modalDropdown}>
                <ScrollView>
                  {renderStatusItems()}
                </ScrollView>
              </View>
            </Pressable>
          </Modal>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 8,
    height: Platform.OS === "web" ? 40 : 52,
    minWidth: Platform.OS === "web" ? 180 : undefined,
    width: Platform.OS === "web" ? undefined : "100%", // Full width on mobile
    maxWidth: Platform.OS === "web" ? 250 : undefined,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
    zIndex: 1000,
    overflow: Platform.OS === "web" ? "visible" : "hidden",
  },
  categoryContainerMobileWeb: {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    alignSelf: "stretch",
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 16,
    minHeight: 24,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: colors.black,
  },
  // === Inline Dropdown List (non-modal) ===
  dropdownList: {
    position: "absolute",
    top: Platform.OS === "web" ? 40 : 52,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10000,
    maxHeight: 260,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: Platform.OS === "android" ? 10 : 0,
  },
  dropdownScrollArea: {
    maxHeight: 260,
    overflow: "scroll",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.placeholdergrey,
    backgroundColor: colors.white,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalDropdown: {
    backgroundColor: colors.white,
    borderRadius: 8,
    maxHeight: "70%",
    paddingVertical: 8,
  },
});

export default OrderStatusDropdown;
