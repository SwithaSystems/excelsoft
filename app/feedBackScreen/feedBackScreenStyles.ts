import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  ratingContainer: {
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  reviewInputContainer: {
    marginBottom: 20,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    height: 100, 
    textAlignVertical: 'top', 
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
  imageContainer:{
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginTop: 10,
  },
  selectedImagesContainer:{
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginTop: 10
  },
  imgContainer:{
    position: "relative", 
    marginRight: 10, 
    marginBottom: 10
  },
  selectedImage:{
    width: 100, 
    height: 100, 
    borderRadius: 8,
  },
  removeImageButton:{
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,   
  },
});

export default styles;
