import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  orderSummaryContainer:{
    marginTop: 0,
    paddingHorizontal: 0
  },
  checkBoxContainer:{
    padding: 0,
    backgroundColor: colors.white,
    borderWidth: 0,
    margin: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 12
  },
  checkBoxText:{
    fontWeight: "normal",
    fontSize: 14,
    marginLeft: 4
  },
  section:{
    marginBottom: 16
  },
  sectionText:{
    fontSize: 14
  },
  sectionHeading :{
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16
  },
    addressTextBox: {
      height: 150,
      borderWidth: 1,
      borderColor: colors.black,
      padding: 10,
      borderRadius: 10,
      textAlignVertical: 'top', 
  },
  changeSlotText:{
    color: colors.primary,
    textDecorationLine: "underline",
    fontSize: 12
  },
  cartItemContainerStyle:{
    paddingHorizontal: 0
  }
});

export default styles;
