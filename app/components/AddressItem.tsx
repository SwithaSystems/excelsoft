import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Address } from "@/services/addressService";
import { StyleSheet } from "react-native";
import colors from "../config/colors";

type AddressItemProps = {
  item: Address;
  onEdit?: (item: Address) => void;
  onDelete?: (item: Address) => void;
  showRadio?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
};

const AddressItem = ({
  item,
  onEdit,
  onDelete,
  onSelect,
  showRadio = false,
  isSelected = false,
}: AddressItemProps) => {
  return (
    <View style={styles.addressSection}>
      {showRadio && (
        <TouchableOpacity onPress={onSelect} style={styles.radioButton}>
          <Ionicons
            name={isSelected ? "radio-button-on" : "radio-button-off"}
            size={20}
            color={isSelected ? colors.primary : "gray"}
          />
        </TouchableOpacity>
      )}
      <View style={styles.addressContainer}>
        <View style={styles.addressDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <Text>{item.line1}</Text>
          <Text>{item.line2}</Text>
          <Text>{item.city}</Text>
          <Text>{item.state}</Text>
          <Text>{item.postalCode}</Text>
          <Text>Phone No: {item.phone}</Text>
        </View>
        <View style={styles.iconRow}>
          {onEdit && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onEdit(item)}
            >
              <Ionicons name="create-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onDelete(item)}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default AddressItem;

const styles = StyleSheet.create({
  addressSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  radioButton: {
    paddingRight: 8,
    paddingTop: 16,
  },
  addressContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "20%",
  },
  addressDetails: {
    width: "80%",
  },
  iconButton: {
    marginLeft: 12,
  },
});
