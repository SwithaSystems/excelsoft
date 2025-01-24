import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: colors.lightgrey,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.black,
  },
});

export default styles;