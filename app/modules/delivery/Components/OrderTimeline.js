import colors from "@/constants/colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet } from "react-native";

const OrderTimeline = (props) => {
  const statusList = props.statusList;
  const reason = props.reason;
  const compact = props.compact || false;
  // const from = props.from;
  const currentStatus = statusList.indexOf(props?.actualStatus);
  const negativeStatuses = ["Cancelled", "Rejected", "Failed"];
  // console.log("currentStatus", currentStatus);
  // console.log("statusList", statusList);

  const icons = [
    "cart-outline",
    "time-outline",
    "card-outline",
    "shield-checkmark-outline",
    "construct-outline",
    "checkmark-circle-outline",
    "car-outline",
    "home-outline",
    "cube-outline",
    "close-circle-outline",
    "warning-outline",
    "ban-outline",
    "alert-circle-outline",
    "swap-horizontal-outline",
    "cash-outline",
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={statusList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isCurrent = index === currentStatus;
          const isNegative = negativeStatuses.includes(item);
          const isActive = index <= currentStatus;

          if (isCurrent && isNegative) {
            // console.log("Reason received in props:", reason);
            // console.log("Actual Status:", props.actualStatus);
            // console.log("Is Negative?", isNegative);
          }

          const itemMarginBottom = compact ? 40 : 90;
          const lineHeight = compact ? 40 : 90;
          const circleSize = compact ? 32 : 40;
          const iconSize = compact ? 18 : 24;
          const fontSize = compact ? 14 : 16;

          return (
            <View style={[styles.itemContainer, { marginBottom: itemMarginBottom }]}>
              {/* Timeline Circle */}
              <View
                style={[
                  styles.circle,
                  {
                    width: circleSize,
                    height: circleSize,
                    borderRadius: circleSize / 2,
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.inactivegrey,
                  },
                ]}
              >
                {/*Icon for each status */}
                <Ionicons
                  name={icons[index]}
                  size={iconSize}
                  color={isActive ? colors.white : colors.white}
                />
              </View>
              {/* Status Text */}
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      fontSize: fontSize,
                      color: isActive ? colors.primary : colors.secondaryText,
                    },
                  ]}
                >
                  {item}
                </Text>

                {isCurrent && isNegative && reason ? (
                  <Text style={styles.reasonText}>
                    {/* {from === "admin"
                  ? `You Reasoned: ${reason}`
                  : `Seller Reasoned: ${reason}`} */}
                    {reason}
                  </Text>
                ) : null}
              </View>
              {/* Connecting Line */}
              {index !== statusList.length && (
                <View
                  style={[
                    styles.line,
                    {
                      left: compact ? 15 : 18,
                      top: circleSize,
                      height: lineHeight,
                      backgroundColor: isActive
                        ? colors.primary
                        : colors.inactivegrey,
                    },
                  ]}
                />
              )}
            </View>
          );
        }}
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
    marginTop: 16,
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
    height: 90,
    width: 1,
    backgroundColor: colors.black,
  },
  reasonText: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "400",
    color: colors.primaryRed,
    maxWidth: 250,
  },
});

export default OrderTimeline;
