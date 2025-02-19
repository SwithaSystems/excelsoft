import colors from "@/app/config/colors";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const OrderTimeline = ({ statusList }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={statusList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            {/* Timeline Circle */}
            <View style={styles.circle} />
            {/* Status Text */}
            <Text style={styles.statusText}>{item}</Text>
            {/* Connecting Line */}
            {index !== statusList.length - 1 && <View style={styles.line} />}
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 18,
    backgroundColor: colors.black,
    marginRight: 30,
  },
  statusText: {
    fontSize: 14,
  },
  line: {
    position: "absolute",
    left: 8,
    top: 12,
    height: 60,
    width: 2,
    backgroundColor: colors.black,
  },
});

export default OrderTimeline;
