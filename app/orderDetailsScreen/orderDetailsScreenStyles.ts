import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cartItemContainerStyle:{
    paddingHorizontal: 0
  },
  barCodeNote:{
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10
  },
  orderSummaryItem:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  orderSummaryItemText:{
    fontSize: 16
  }
});

export default styles;
