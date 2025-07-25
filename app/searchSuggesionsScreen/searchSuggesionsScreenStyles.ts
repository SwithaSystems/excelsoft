import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
    color: colors.black,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.offWhite,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  suggestionsList: {
    flex: 1,
    width: '100%',
  },
  suggestion: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
    backgroundColor: 'white',
    fontSize: 16,
  }
});

export default styles;
