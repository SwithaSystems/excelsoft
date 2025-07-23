import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    fontSize: 16,
    color: "#007AFF",
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: "#e8f5e8",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#2d6a2d",
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  debugBox: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#495057",
  },
  debugText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 5,
  },
});

export default styles;
