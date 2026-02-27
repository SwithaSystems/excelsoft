import { StyleSheet, Platform } from 'react-native';
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  pageHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
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
  submitSection: {
    marginTop: 8,
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
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  selectedImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10
  },
  imgContainer: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,
  },

  // Web-specific styles
  webScrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  webScroll: {
    flex: 1,
  },
  webContentWrapper: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: Platform.OS === 'web' ? 24 : 0,
    paddingHorizontal: 0,
  },
  webFormDesktop: {
    maxWidth: 560,
    width: '100%',
  },
  webFormMobile: {
    maxWidth: '100%',
    width: '100%',
  },
  webAddImageButton: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderColor: colors.lightgrey,
  },
  webSelectedImagesContainer: {
    marginTop: 12,
    gap: 8,
  },
  webImgContainer: {
    marginRight: 8,
    marginBottom: 8,
  },
  webSelectedImage: {
    width: 88,
    height: 88,
    borderRadius: 8,
  },
  webSubmitButton: {
    width: '100%',
    borderRadius: 8,
  },
});

export default styles;
