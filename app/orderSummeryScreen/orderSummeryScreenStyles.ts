import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  orderSummaryContainer:{
    marginTop: 0,
    paddingHorizontal: 0
  },
  subheading:{
    fontWeight:'bold',
    paddingRight: 12,
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
      // height: 150,
      // borderWidth: 1,
      // borderColor: colors.black,
      //padding: 10,
      borderRadius: 10,
      textAlignVertical: 'top', 
  },
  billingAddress:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
  },
  billingAddressAccordian:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    marginLeft: 10,
  },
  changeSlotText:{
    color: colors.primary,
    textDecorationLine: "underline",
    fontSize: 12
  },
  cartItemContainerStyle:{
    paddingHorizontal: 0
  },
  addressContainer:{
    flexDirection: 'column',
    paddingRight: 16,
  },
  addressList: {
    paddingHorizontal: 26,
  },
  deliverAddress:{
    flexDirection: 'row'
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  accordianIcon:{
    marginLeft: 'auto'
  },
  accordian:{
    //marginLeft:'auto'
  }, 
  accordionContent: {
  marginTop: 10,
  paddingLeft: 10,
  borderLeftWidth: 1,
  borderLeftColor: '#e0e0e0',
},
noAddressContainer: {
  padding: 16,
  alignItems: 'center',
  justifyContent: 'center'
},
noAddressText: {
  color: colors.placeholdergrey,
  fontSize: 16
},
});

export default styles;
