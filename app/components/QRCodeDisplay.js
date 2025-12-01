import colors from "@/constants/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-qr-code";

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
            <Text style={styles.noteText}>{props.noteText}</Text>
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
    fontSize: 14,
    color: colors.error,
    marginBottom: 16,
  },
});

export default QRCodeDisplay;
