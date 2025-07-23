import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { height } = Dimensions.get("window");

type MessageProps = {
  text1: string;
  text2?: string;
  onPress?: () => {};
};

const CustomToastAlert = (props: MessageProps) => {
  return (
    <TouchableOpacity style={styles.toastContainer} onPress={props.onPress}>
      <View style={styles.container}>
        <Ionicons
          name="checkmark-circle"
          color={colors.primary}
          style={styles.Icon}
          size={36}
        />
        <View style={styles.textContainer}>
          <Text style={styles.Text1}>{props.text1}</Text>
          {props.text2 ? <Text style={styles.Text2}>{props.text2}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomToastAlert;

const styles = StyleSheet.create({
  toastContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0,
    width: "100%",
    height: height,
    zIndex: 1,
  },
  container: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 50,
    width: "70%",
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  textContainer: {
    alignItems: "flex-start",
    marginLeft: 12,
  },
  Text1: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  Text2: {
    fontSize: 14,
    fontWeight: "300",
    color: colors.primary,
    paddingTop: 4,
  },
  Icon: {},
});
