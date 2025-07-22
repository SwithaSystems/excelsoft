import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "./commonComponents/Button";

function NoContentFound(props) {
  return (
    <>
      <View style={globalStyles.container}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            justifyContent: "center",
          }}
        >
          {props.message}
        </Text>
        {props.buttonText && (
          <Button
            title={props.buttonText}
            onPress={props.onPress}
            style={{ marginTop: 16 }}
          />
        )}
      </View>
    </>
  );
}

export default NoContentFound;
