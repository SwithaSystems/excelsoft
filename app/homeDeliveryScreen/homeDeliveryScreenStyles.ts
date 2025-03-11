import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.black,
    lineHeight: 24,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.black,
  },
  inputContainer: {
    marginBottom: 20,
  },
  required: {
    color: colors.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: colors.white,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default styles;
