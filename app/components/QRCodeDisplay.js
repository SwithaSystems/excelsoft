import colors from "@/constants/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-qr-code";
import { Ionicons } from "@expo/vector-icons";

const QRCodeDisplay = (props) => {
  const qrValue = "5555";
  const hideNumber = props.hideNumber || false;

  return (
    <>
      {props.qrValue ? (
        <View style={styles.container}>
          <QRCode value={props.qrValue.toString()} size={props.size || 200} />
          {!hideNumber && (
            <Text
              style={{
                fontWeight: 600,
                fontSize: 36,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              {props.qrValue}
            </Text>
          )}
          {props.noteText && (
            <View style={styles.noteBox}>
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.primary}
                style={styles.noteIcon}
              />
              <Text style={styles.noteText}>{props.noteText}</Text>
            </View>
          )}
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  noteText: {
    fontWeight: 500,
    fontSize: 12,
    color: colors.black,
    // marginBottom: 16,
  },
   noteBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 16,
  },

  noteIcon: {
    marginRight: 6,
    marginTop: 2,
  },
});

export default QRCodeDisplay;
