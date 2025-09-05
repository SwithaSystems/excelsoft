import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import colors from "@/constants/colors";

interface ConfirmationModalProps {
  isModalVisible: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  submitText?: string;
  cancelText?: string;
  handleSubmit?: () => void;
  handleCancel?: () => void;
  animationType?: "none" | "slide" | "fade";
}


function ConfirmationModal({
  isModalVisible,
  onClose,
  title,
  text,
  submitText,
  cancelText,
  handleSubmit,
  handleCancel,
  animationType = "fade",
} : ConfirmationModalProps) {
  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.dialogBox}>
          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* text */}
          {text && <Text style={styles.text}>{text}</Text>}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            {cancelText && (
              <TouchableOpacity onPress={handleCancel} style={styles.button}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            {submitText && (
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.submitText}>{submitText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    width: "85%",
    backgroundColor: colors.white,
    // borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 15,
    color: colors.linkBlue, 
    fontWeight: "500",
  },
  submitText: {
    fontSize: 15,
    color: colors.error, 
    fontWeight: "500",
  },
});

export default ConfirmationModal;
