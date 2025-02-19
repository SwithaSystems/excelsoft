import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    marginBottom: 28,
  },
  contactOption: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom:10,
  },
  iconContainer: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  availability: {
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    display: "flex"
  },
});

export default styles;
