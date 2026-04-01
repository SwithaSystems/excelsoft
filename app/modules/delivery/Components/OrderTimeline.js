import colors from "@/constants/colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet } from "react-native";

const OrderTimeline = (props) => {
  const statusList = props.statusList;
  const reason = props.reason;
  const compact = props.compact || false;
  const horizontal = props.horizontal || false;
  const isPickupTimeline = statusList.includes("Collected") && !statusList.includes("Delivered");
  const normalizedActualStatus =
    isPickupTimeline && props?.actualStatus === "Delivered"
      ? "Collected"
      : props?.actualStatus;
  const currentStatus = statusList.indexOf(normalizedActualStatus);
  const negativeStatuses = ["Cancelled", "Rejected", "Failed"];

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

  if (horizontal) {
    return (
      <View style={styles.horizontalContainer}>
        {statusList.map((item, index) => {
          const isCurrent = index === currentStatus;
          const isNegative = negativeStatuses.includes(item);
          const isActive = index <= currentStatus;
          const circleSize = compact ? 36 : 42;
          const iconSize = compact ? 18 : 22;
          const fontSize = compact ? 13 : 15;

          return (
            <View key={`${item}-${index}`} style={styles.horizontalItem}>
              <View style={styles.horizontalTopRow}>
                <View
                  style={[
                    styles.horizontalCircle,
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
                  <Ionicons
                    name={icons[index]}
                    size={iconSize}
                    color={colors.white}
                  />
                </View>
                {index !== statusList.length - 1 && (
                  <View
                    style={[
                      styles.horizontalLine,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.inactivegrey,
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.horizontalStatusText,
                  {
                    fontSize,
                    color: isActive ? colors.primary : colors.secondaryText,
                  },
                ]}
                numberOfLines={2}
              >
                {item}
              </Text>
              {isCurrent && isNegative && reason ? (
                <Text style={styles.horizontalReasonText}>{reason}</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={statusList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isCurrent = index === currentStatus;
          const isNegative = negativeStatuses.includes(item);
          const isActive = index <= currentStatus;

          const itemMarginBottom = compact ? 40 : 90;
          const lineHeight = compact ? 40 : 90;
          const circleSize = compact ? 32 : 40;
          const iconSize = compact ? 18 : 24;
          const fontSize = compact ? 14 : 16;

          return (
            <View style={[styles.itemContainer, { marginBottom: itemMarginBottom }]}>
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
                <Ionicons
                  name={icons[index]}
                  size={iconSize}
                  color={isActive ? colors.white : colors.white}
                />
              </View>
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
                    {reason}
                  </Text>
                ) : null}
              </View>
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
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 0,
    width: "100%",
  },
  horizontalItem: {
    flex: 1,
    minWidth: 0,
  },
  horizontalTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  horizontalCircle: {
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  horizontalLine: {
    height: 3,
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 999,
  },
  horizontalStatusText: {
    fontWeight: "600",
    paddingRight: 10,
    lineHeight: 18,
  },
  horizontalReasonText: {
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "400",
    color: colors.primaryRed,
    marginTop: 6,
    paddingRight: 10,
  },
});

export default OrderTimeline;
