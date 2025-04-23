import { StyleSheet } from 'react-native';
import { colors } from 'react-native-elements';

const styles = StyleSheet.create({
 container: {
     flex: 1,
     backgroundColor: colors.white,
     paddingHorizontal:16,
   },
  text: {
    fontSize: 12,
    color: 'black',
  },
  userDetails:{
    paddingHorizontal: 16,
    marginVertical:16,
   },
   details: {
    flexDirection: "row",
    flexWrap: "wrap",
   },
   subHeading:{
    fontWeight: "bold"
   },
   orderdetails:{

   },
   cartItem: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
  },
   itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemQty: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#888",
    fontSize: 13,
    marginLeft: 4,
  },
  striked: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 14,
  },
});

export default styles;
