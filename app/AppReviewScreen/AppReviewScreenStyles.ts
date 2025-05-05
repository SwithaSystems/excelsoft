import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  secondaryText:{
    marginBottom: 16,
  },
  ratingCategory:{
    marginBottom: 16,
  },
  selectCategory: {
    marginBottom: 16,
  },
  chooseCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    //paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  categoryText: {
    flex: 1,
    fontSize: 14,
    color: colors.placeholdergrey,
  },
  radioContainer: {
    marginVertical: 16,
    //marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    color: colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: colors.black,
  },
  addYourReview: {
    marginVertical: 16,
  },
  reviewText: {
    height: 150,
    backgroundColor: colors.placeholdergrey,
    borderWidth: 0,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',  
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewContainer:{
    padding:16,
    marginBottom:64,
  },
  label:{
    fontSize: 16,
    color: colors.black,
    marginBottom:4,
  }
});

export default styles;
