import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  returnOrderCategory:{
    flexDirection: "row",
    justifyContent: "space-between", 
    marginVertical: 17, 
    marginBottom: 16,
  },
  returnOrderItemText:{
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  returnOrderId: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemContainerStyle:{
    paddingHorizontal: 0
  }, 
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
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
  returnModeCategory:{

  },
  returnHeading:{

  },
  label:{
    fontSize: 15,
    fontWeight: "semibold",
    marginBottom: 16,
  },
 option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.lightSkyBlue,
    elevation: 4,
    shadowColor: '#DEF7FC', 
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
    
    timeContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    }, 
    timeInput: {
      backgroundColor: colors.lightgrey,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      marginRight: 8,
    },
    hourMinuteInput: {
      width: 60,
    },
    amPmSelector: {
      // backgroundColor: '#f8f8f8',
      borderRadius: 8,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      width: 80,
      justifyContent: 'space-between',
    },
    amPmText: {
      fontSize: 16,
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
        paddingVertical: 10,
        backgroundColor: colors.placeholdergrey,
        marginTop: 10,
      },
      placeholderText: {
        flex: 1,
        fontSize: 16,
      },
      addComments: {
        marginBottom: 16,
      },
      commentsText: {
        height: 150,
        backgroundColor: colors.placeholdergrey,
        borderWidth: 0,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',  
      },
      cancelOrderDetails:{
        marginBottom: 16,
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
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      }, 
      submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom:32,
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
});

export default styles;
