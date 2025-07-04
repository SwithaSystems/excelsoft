import { StyleSheet, Platform } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.offWhite,
  },
  text: {
    fontSize: 12,
    color: 'black',
  },
  searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.white,
      borderRadius: 25,
      marginVertical: 12,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "ios" ? 12 : 8,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      borderWidth: Platform.OS === "ios" ? 1 : 0,
      borderColor: colors.lightgrey,
      minHeight: Platform.OS === "ios" ? 50 : 44,
    },
  
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.black,
      paddingVertical: Platform.OS === "ios" ? 8 : 4,
      paddingHorizontal: 0,
      minHeight: Platform.OS === "ios" ? 40 : 36,
      textAlignVertical: "center",
      lineHeight: Platform.OS === "ios" ? 20 : undefined,
    },
  
    searchIcon: {
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    tableHeader: {
      borderBottomWidth: 2,
      borderBottomColor: '#000',
      marginBottom: 5,
    },
    headerText: {
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    cell: {
      flex: 1,
      fontSize: 14,
    },
    checkboxCell: {
      flexBasis: '10%',
      justifyContent: 'center',
      alignItems: 'center',
      height: 20,
    },
    nameCell: {
      flexBasis: '30%',
      fontSize: 14,
    },

    phoneCell: {
      flexBasis: '30%',
      fontSize: 14,
    },

    emailCell: {
      flexBasis: '30%',
      fontSize: 14,
    },
    seeMoreButton: {
      padding: 10,
      backgroundColor: '#00bcd4',
      alignSelf: 'center',
      borderRadius: 20,
      marginTop: 10,
    },
    seeMoreText: {
      color: '#fff',
      fontWeight: 'bold',
    },
});

export default styles;
