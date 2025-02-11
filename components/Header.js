import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../app/config/colors";
import BackArrow from "./commonComponents/BackArrow";
import SearchBar from "@/app/components/searchBar";
import { useRouter } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

function Header(props) {
  const router = useRouter();

  const handleSearchSubmit = () => {
    redirectToPage(containers.searchScreen);
  };
  return (
    <>
      {props.headerText && (
        <View style={[styles.header, props?.headerStyle]}>
          <View style={{ position: "absolute", left: 16, top: 16, zIndex: 1 }}>
            <BackArrow />
          </View>
          <Text style={styles.headerTitle}>{props.headerText}</Text>
        </View>
      )}
      {props?.searchBarNeeded && (
        <View>
          <SearchBar
            placeholder="Search..."
            onFocus={handleSearchSubmit}
            onPress={handleSearchSubmit}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 40,
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    width: "100%",
    textAlign: "center",
  },
});
export default Header;
