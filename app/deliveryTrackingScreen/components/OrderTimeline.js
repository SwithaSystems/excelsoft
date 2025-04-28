import colors from "@/app/config/colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet } from "react-native";

const OrderTimeline = ({ statusList }) => {

  const icons = [
    "document-text-outline",
    "cube-outline",
    "car-outline",
    "location-outline",
    "checkmark-circle-outline",
  ];

  const currentStatus = 2;
  return (
    <View style={styles.container}>
      <FlatList
        data={statusList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            {/* Timeline Circle */}
            <View style={[styles.circle,
                  {backgroundColor: index <= currentStatus ? "#17C6ED":"#7E8A8C"}
              ]}>
                {/*Icon for each status */}
                <Ionicons 
                  name={icons[index]}
                  size={22}
                  color={index <= currentStatus ? "white" : "white"}
                />
          </View>
            {/* Status Text */}
            <Text 
              style={[
                styles.statusText,
                {color: index <= currentStatus ? "#17C6ED":"#7E8A8C"}
              ]}
            >{item}
            </Text>
            {/* Connecting Line */}
            {index !== statusList.length && 
              <View style={[
                styles.line,
                {backgroundColor: index < currentStatus ? "#17C6ED":"#7E8A8C"}
              ]} 
              />
            }
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
    marginBottom: 90,
    position: "relative",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
    marginRight: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  line: {
    position: "absolute",
    left: 18,
    top: 40,
    height: 60,
    width: 1,
    backgroundColor: colors.black,
  },
});

export default OrderTimeline;