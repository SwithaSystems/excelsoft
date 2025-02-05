import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import Button from "./Button";

function ConfirmationModal(props) {
  return (
    <>
      {props.isModalVisible && (
        <Modal
          visible={props.isModalVisible}
          transparent={true}
          animationType={props?.animationType || "slide"}
        >
          <TouchableWithoutFeedback onPress={() => props.onClose()}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={{ fontWeight: 500, fontSize: 16 }}>
                  {props.text}
                </Text>
                <View style={styles.modalButtons}>
                  <Button
                    style={{ marginBottom: 16 }}
                    onPress={props?.handleSubmit}
                    title={props.submitText}
                  />
                  <Button
                    onPress={props?.handleCancel}
                    title={props.cancelText}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 34,
    paddingTop: 50,
    paddingBottom: 16,
    borderRadius: 8,
    alignItems: "center",
    maxWidth: "80%",
  },
  modalButtons: {
    marginTop: 16,
    width: "70%",
  },
});

export default ConfirmationModal;
