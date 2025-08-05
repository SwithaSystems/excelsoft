import { Alert } from "react-native";

export const showErrorAlert = ({ title, message, buttonLabel = "OK" }) => {
  Alert.alert(title, message, [{ text: buttonLabel }]);
};
