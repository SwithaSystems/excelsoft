import React from "react";
import { View } from "react-native";
import { globalStyles } from "../assets/styles/globalStyles";

function NoContentFound(props) {
  return (
    <>
      <View style={globalStyles.container}>
        <Text>No data found</Text>
      </View>
    </>
  );
}

export default NoContentFound;
