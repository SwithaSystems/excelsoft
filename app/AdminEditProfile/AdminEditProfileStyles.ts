import { StyleSheet } from 'react-native';
import colors from '../config/colors';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const calculatedRight = (screenWidth)/2 -45;

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
  changePictureButton: {
    position: 'absolute',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 4,
    top: 55,
    right: calculatedRight,
  },
  changePictureText: {
    fontSize: 16,
    color: colors.black,
  },
});

export default styles;
