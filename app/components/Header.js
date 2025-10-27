import React from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import colors from "../../constants/colors";
import BackArrow from "./commonComponents/BackArrow";
import SearchBar from "@/app/components/searchBar";
import { useRouter } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

function Header(props) {
  const handleSearchSubmit = () => {
    redirectToPage(containers.searchScreen);
  };

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;


  return (
    <View style={styles.headerWrapper}>
      {props.headerText && (
        <View style={[styles.header, props?.headerStyle]}>
          {!isTabOrDesktop && (
            <View style={styles.leftContainer}>
              <BackArrow needResetNavigation={props.needResetNavigation} />
            </View>)}

          <View style={styles.centerContainer}>
            <Text style={styles.headerTitle}>{props.headerText}</Text>
          </View>

          <View style={styles.rightContainer}>
            {props.secondaryBtnText && (
              <TouchableOpacity
                onPress={() => {
                  props?.secondaryBtnCallBack?.();
                }}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>
                  {props.secondaryBtnText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {props?.searchBarNeeded && (
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search..."
            onFocus={handleSearchSubmit}
            onPress={handleSearchSubmit}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 10, // Standard header height
    backgroundColor: colors.white,
  },
  leftContainer: {
    flex: 0,
    minWidth: 40,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    flex: 0,
    minWidth: 40,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
  },
  secondaryButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default Header;
