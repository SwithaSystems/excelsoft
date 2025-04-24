import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import colors from "@/app/config/colors";

const CustomOverlay = (props) => {
  return (
    <View>
      <Modal visible={props.visible} transparent={true} animationType="fade">
        <View style={styles.background}>
          <View style={styles.overlay}>
            {/* <BlurView 
                            style={styles.blurbackground}
                            blurType = "dark"
                            blurAmount={10}
                        />*/}
            <Text style={styles.text}>{props.overlayText}</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonview}>
                <Button
                  title={props.okButtonText}
                  color={colors.primary}
                  onPress={props.onOk}
                  style={styles.button}
                />
              </View>
              <View style={styles.buttonview}>
                <Button
                  title={props.cancelButton}
                  color={colors.primary}
                  onPress={props.onCancel}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
  },
  overlay: {
    backgroundColor: colors.white,
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  text: {
    color: colors.black,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonview: {
    marginBottom: 16,
  },
  button: {
    color: colors.primary,
  },
  buttonContainer: {
    width: "70%",
  },
});

export default CustomOverlay;
