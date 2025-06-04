import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  heading:{
    fontSize: 20,
    marginBottom: 24,
  },
  ordersContainer:{
    paddingHorizontal: 24,
  },
  eachOrderItem:{
    borderColor: colors.placeholdergrey,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 24,
    padding: 16,
  },
  searchBarContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 20,
  paddingHorizontal: 16,
  marginBottom: 20,
},

searchInput: {
  flex: 1,
  fontSize: 16,
},

searchIcon: {
  marginLeft: 10,
},

});

export default styles;
