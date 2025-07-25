import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex:1,
  },
  returnOrderCategory: {
    flexDirection: "row",
    justifyContent: "space-between",
    //paddingHorizontal: 20,  
    //marginVertical: 16, 
    //marginBottom: 10
  },
  returnOrderItemText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  returnOrderId: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItemsContainer:{
    marginTop: 16,
  },
  checkBoxContainer: {
      //backgroundColor: colors.white,
      borderWidth: 0,
      padding: 10,
      marginTop: 0,
      marginBottom: 16,
      marginLeft: 0,
      marginRight: 0,
    },
    checkBoxText: {
      color: colors.black,
      fontWeight: 400,
    },
  cartItemContainerStyle:{
    paddingHorizontal: 0
  }, 
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.offWhite,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 16,
    alignItems: "center",
    height: 120,
    //flex: 1,
  },
  itemImage: {
    width: 120,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height:'100%',
    aspectRatio:1,
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
    paddingLeft: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemQty: {
    fontSize: 14,
    color: colors.darkGray,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.black,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: colors.darkGray,
    fontSize: 13,
    marginLeft: 4,
  },
  striked: {
    textDecorationLine: "line-through",
    color: "gray",
    fontSize: 14,
  },
  returnModeCategory: {},
  returnHeading: {},
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.lightSkyBlue,
    elevation: 4,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 4,
  },
  selectedOption: {
    borderColor: colors.primary,
  },
  textContainer: {
      flex: 1,
      paddingHorizontal: 16
    },
    optionLabel: {
      fontSize: 16,
      color: colors.black,
    },
    optionDescription: {
      fontSize: 14,
      color: colors.secondaryText,
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    selectedRadio: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    datetimeContainer:{
        flexDirection: "row",
        gap: 20,
    },
    inputContainer: {
      marginBottom: 16,

    },
    inputLabel: {
      fontSize: 16,
      marginBottom: 4,
    },
    required: {
      color: 'red',
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
    label: {
      fontSize: 16,
      marginBottom: 16,
      fontWeight:"bold",
    },
    timeContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    }, 
    timeInput: {
      backgroundColor: colors.white,
      borderWidth:1,
      borderColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 4,
      fontSize: 14,
      marginRight: 8,
      textAlign: 'center',
      width:60,
      height:40,
    },
    hourMinuteInput: {
      width: 50,
    },
    amPmSelector: {
      // backgroundColor: colors.lightgrey,
      borderRadius: 8,
      borderWidth:1,
      borderColor: colors.primary,
      padding: 15,
      //flexDirection: 'row',
      //alignItems: 'center',
      width: 120,
      height:40,
      justifyContent: 'center',
    },
    amPmText: {
      fontSize: 16,
    },
    timeRow: {
      flexDirection: 'column',
      //alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },    
    returnReason: {
        marginBottom: 16,
      },
      selectReason: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        paddingHorizontal: 12,
        //paddingVertical: 10,
        backgroundColor: colors.placeholdergrey,
      },
      placeholderText: {
        flex: 1,
        fontSize: 16,
        backgroundColor: colors.placeholdergrey,
      },
      addComments: {
        marginVertical: 20,
      },
      commentsText: {
        height: 150,
        backgroundColor: colors.placeholdergrey,
        borderWidth: 0,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',  
      },
      returnOrderSummary:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20, 
        marginBottom: 10
      },
      returnOrderDetails:{
        color: colors.black,
        fontSize: 16,
      },
      refundStatusSection:{
        marginVertical: 16,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      }, 
      submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
       // marginBottom:32,
        alignItems: 'center',
        marginTop: 20,
     },
     replacementButton: {
      backgroundColor: colors.reviewsColor,
      paddingVertical: 15,
      borderRadius: 8,
      marginBottom:32,
      alignItems: 'center',
      marginTop: 20,
   },
   noteText:{
      color: colors.black,
   },
   returnModes:{
    flexDirection: "row-reverse",
    alignItems:"center",
   },
   returnSection:{
    marginBottom: 16,
   },
   buttonContainer:{

   },
   timeSection: {
    flexDirection: 'column',
  },
   pickerContainer: {
    borderColor: colors.primary,
    borderWidth: 1,
    height: 40,
    width: 150,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default styles;
