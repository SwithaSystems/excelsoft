import colors from "@/app/config/colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet } from "react-native";

const OrderTimeline = (props) => {
  const statusList = props.statusList;
  const currentStatus = statusList.indexOf(props?.actualStatus);
  console.log("currentStatus", currentStatus);
  console.log("statusList", statusList);

  const icons = [
    "document-text-outline",
    "cube-outline",
    "car-outline",
    "location-outline",
    "checkmark-circle-outline",
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={statusList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            {/* Timeline Circle */}
            <View
              style={[
                styles.circle,
                {
                  backgroundColor:
                    index <= currentStatus
                      ? colors.primary
                      : colors.secondaryText,
                },
              ]}
            >
              {/*Icon for each status */}
              <Ionicons
                name={icons[index]}
                size={22}
                color={index <= currentStatus ? colors.white : colors.white}
              />
            </View>
            {/* Status Text */}
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    index <= currentStatus
                      ? colors.primary
                      : colors.secondaryText,
                },
              ]}
            >
              {item}
            </Text>
            {/* Connecting Line */}
            {index !== statusList.length && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      index < currentStatus
                        ? colors.primary
                        : colors.secondaryText,
                  },
                ]}
              />
            )}
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
