import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.lightgrey,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 4,
  },
  required: {
    color: 'red',
  },dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },sectionTitle: {
    fontSize: 15,
    marginTop: 20,
    marginBottom: 16,
  },
});

export default styles;
