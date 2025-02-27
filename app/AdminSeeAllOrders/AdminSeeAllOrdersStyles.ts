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
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 24,
    padding: 16,
  },
});

export default styles;
