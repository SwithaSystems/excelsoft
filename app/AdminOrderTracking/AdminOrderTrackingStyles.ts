import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
  },
  text: {
    fontSize: 12,
    color: 'black',
  },
  trackingContainer:{
   
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  } , 
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom:32,
    alignItems: 'center',
    marginTop: 20,
  },
   userDetails:{
    backgroundColor: colors.secondary,
    borderRadius: 20,
    marginHorizontal: 24,
    marginVertical: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.black
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
});

export default styles;
