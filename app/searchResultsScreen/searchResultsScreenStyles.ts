import { StyleSheet, Dimensions } from 'react-native';
import colors from '../config/colors';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between items (16)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 90,
    color: colors.black,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.reviewsColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
    paddingTop: 0,
    
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productItem: {
    width: itemWidth,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  leftItem: {
    marginRight: 8,
    flex: 1,
  },
  rightItem: {
    marginLeft: 8,
    flex:1,
  },
});

export default styles;
