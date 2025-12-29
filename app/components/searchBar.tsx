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
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

interface SearchBarProps {
  placeholder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  onLayout?: (event: { nativeEvent: { layout: { width: number; height: number } } }) => void; // Only used for tablet/desktop (width >= 768px) - ignored on mobile
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
  onBlur,
  onPress,
  value = "",
  onChangeText = () => {},
  onSubmitEditing = () => {},
  onLayout,
  widthPercent,
  height,
}: SearchBarProps) => {
  const { width } = useWindowDimensions();
  const { isWeb, isMobile, isLargeDesktop } = useWebMediaQuery();
  
  // For web, use media query-based breakpoints; for native, use width-based fallback
  const isMobileWidth = isWeb ? isMobile : width < 768;
  const defaultBarWidth = isMobileWidth 
    ? "100%" 
    : isWeb && isLargeDesktop 
    ? "40%" 
    : "60%";
  const barWidth = isMobileWidth
    ? "100%"
    : typeof widthPercent === "number"
    ? `${Math.min(100, Math.max(0, widthPercent))}%`
    : defaultBarWidth;

  const containerStyle = [
    styles.searchContainer,
    { 
      width: barWidth as `${number}%`, 
      alignSelf: (isMobileWidth ? "center" : "flex-start") as "center" | "flex-start",
      height: typeof height === "number" ? height : isMobileWidth ? 52 : 40,
      minWidth:0,
    },
  ];

  const inputStyle = [
    styles.searchInput,
    { 
      fontSize: isMobileWidth ? 14 : 16, 
      paddingVertical: isMobileWidth ? 8 : 6,
      minWidth:0,
      // Only on desktop/tablet: remove default web outline to avoid half-box
      ...(isMobileWidth
        ? {}
        : ({ outlineWidth: 0, outlineColor: 'transparent', borderWidth: 0 } as any)),
    },
  ];

  return (
    <View 
      style={containerStyle} 
      // onLayout is only used for tablet/desktop (width >= 768px) to measure width for dropdown suggestions
      // On mobile (width < 768px), onLayout is ignored even if provided to ensure mobile functionality is unaffected
      onLayout={!isMobileWidth && onLayout ? onLayout : undefined}
    >
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholdergrey}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === "Enter") onSubmitEditing();
        }}
      />
      <Touchable onPress={onPress} style={styles.iconWrapper}>
        <Ionicons
          name="search"
          size={isMobileWidth ? 18 : 22}
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
    // justifyContent: "center",
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
    flexShrink: 1,
    // minHeight: 32,
  },
iconWrapper: {
  paddingLeft: 10,
  paddingRight: 6,
  minWidth: 40,
  alignSelf: "stretch",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  flexGrow: 0,
}
});
