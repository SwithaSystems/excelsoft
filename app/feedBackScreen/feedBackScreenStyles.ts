import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  ratingContainer: {
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewInputContainer: {
    marginBottom: 20,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    height: 100, // Adjust as needed
    textAlignVertical: 'top', // Align text to the top (Android)
  },
  imagePickerContainer: {
    marginBottom: 20,
  },
  addImageButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: 'skyblue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
