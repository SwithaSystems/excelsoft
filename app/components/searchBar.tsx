import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

interface SearchBarProps {
  placeholder: string;
  onFocus?: () => void;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  widthPercent?: number; // optional width override for non-mobile (0-100)
  height?: number; // optional height override
}

const Touchable = ({ onPress, children, style }: any) => {
  const isWeb = typeof document !== "undefined"; 
  if (isWeb) {
    return (
      <button
        onClick={onPress}
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        {children}
      </button>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
};

const SearchBar = ({
  placeholder = "",
  onFocus,
  onPress,
  value = "",
  onChangeText = () => {},
  onSubmitEditing = () => {},
  widthPercent,
  height,
}: SearchBarProps) => {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const defaultBarWidth = isMobile ? "100%" : width < 1280 ? "60%" : "40%";
  const barWidth = isMobile
    ? "100%"
    : typeof widthPercent === "number"
    ? `${Math.min(100, Math.max(0, widthPercent))}%`
    : defaultBarWidth;

  const containerStyle = [
    styles.searchContainer,
    { 
      width: barWidth as `${number}%`, 
      alignSelf: (isMobile ? "center" : "flex-start") as "center" | "flex-start",
      height: typeof height === "number" ? height : isMobile ? 52 : 40
    },
  ];

  const inputStyle = [
    styles.searchInput,
    { 
      fontSize: isMobile ? 14 : 16, 
      paddingVertical: isMobile ? 8 : 6,
      // Only on desktop/tablet: remove default web outline to avoid half-box
      ...(isMobile
        ? {}
        : ({ outlineWidth: 0, outlineColor: 'transparent', borderWidth: 0 } as any)),
    },
  ];

  return (
    <View style={containerStyle}>
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        onFocus={onFocus}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === "Enter") onSubmitEditing();
        }}
      />
      <Touchable onPress={onPress}>
        <Ionicons
          name="search"
          size={isMobile ? 18 : 22}
          color={colors.primary}
        />
      </Touchable>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 0.5,
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: colors.black,
    backgroundColor: 'transparent',
    // minHeight: 32,
  },
});
