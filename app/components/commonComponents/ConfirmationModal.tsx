import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
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
}: ConfirmationModalProps) {
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[
          styles.dialogBox,
          isTabOrDesktop && styles.dialogBoxWeb
          ]}>
          {/* Title */}
          {title && <Text style={[
            styles.title,
            isTabOrDesktop && styles.titleWeb
            ]}>
            {title}
            </Text>}

          {/* text */}
          {text && <Text style={[
            styles.text,
            isTabOrDesktop && styles.textWeb
          ]}>{text}</Text>}


          {/* Buttons */}
          <View style={[
            styles.buttonRow,
            isTabOrDesktop && styles.buttonRowWeb
          ]}>

            {cancelText && (
              <TouchableOpacity onPress={handleCancel} style={styles.button}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            {submitText && (
              <TouchableOpacity 
                onPress={handleSubmit} 
                style={[
                  styles.button,
                  isTabOrDesktop && styles.buttonWeb,
                  isTabOrDesktop && styles.submitButton
                ]}
              >
                <Text style={[
                  styles.submitText,
                  isTabOrDesktop && styles.submitTextWeb
                ]}>{submitText}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    width: "85%",
    backgroundColor: colors.white,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dialogBoxWeb: {
    width: "90%",
    maxWidth: 500,
    borderRadius: 12,
    padding: 32,
  },
  titleWeb: {
    fontSize: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.primary,
  },
  text: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  textWeb: {
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonRowWeb: {
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonWeb: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 100,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  cancelText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "500",
  },
  cancelTextWeb: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitText: {
    fontSize: 15,
    color: colors.error,
    fontWeight: "500",
  },
  submitTextWeb: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
  },
});

export default ConfirmationModal;
