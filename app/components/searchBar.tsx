import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";

interface SearchBarProps {
  placeholder: string;
  onFocus?: () => void;
  onPress?: () => void; 
  value?:string;
  onChangeText?:(text:string)=>void;
  onSubmitEditing?:()=>void;

}

const SearchBar = ({ placeholder="", onFocus , onPress,value="",onChangeText=()=>{}, onSubmitEditing=()=>{} }: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        onFocus={onFocus}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="search" size={20} color={colors.primary} />
      </TouchableOpacity>
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
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: colors.black
  },
});
