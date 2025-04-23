import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 12,
    color: 'black',
  },
  clearButton:{
    marginVertical: 16,
    marginRight: 16,
  },
  buttonText:{
    textAlign:"right",
    color:colors.primary,
  },
  notification:{
    flexDirection:"row",
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical:8,
    alignItems: "center"
  },
  notificationText:{
    flexWrap: "wrap",
    fontSize: 16,
    color: colors.black,
  },
});

export default styles;
