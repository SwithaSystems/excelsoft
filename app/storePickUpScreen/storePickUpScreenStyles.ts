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
  required: {
    color: 'red',
  },timeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  }, timeInput: {
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
    // backgroundColor: colors.lightgrey,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'space-between',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  amPmText: {
    fontSize: 16,
  },
  // note:{
  //   color: colors.buttonError,
  //   fontSize: 14,
  // },
  sectionTitle: {
    fontSize: 15,
    marginTop: 20,
    marginBottom: 16,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.black,
  },
  radioText: {
    fontSize: 15,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },  input: {
    backgroundColor: colors.lightgrey,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 4,
  },


});

export default styles;
