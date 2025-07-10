import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  debugContainer: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  debugText: {
    fontSize: 12,
    color: "#856404",
    marginBottom: 2,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  modalSelector: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  backgroundColor: '#fff',
},
  modalInitValue: {
    color: '#888',
  },
  modalSelectedText: {
    fontSize: 16,
    color: '#000',
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalSelectedItemText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  modalTriggerText: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
  },
  helpContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  helpText: {
    fontSize: 14,
    color: "#1976d2",
    textAlign: "center",
    lineHeight: 20,
  },
  fileInfoContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fileInfoText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chooseButton: {
    backgroundColor: colors.primary,
    flex: 1,
    marginRight: 10,
  },
  alternativeButton: {
    backgroundColor: "#FF9800",
    flex: 1,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
