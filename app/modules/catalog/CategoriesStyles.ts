import { StyleSheet, Dimensions } from 'react-native';



const { width } = Dimensions.get('window');
const itemWidth = (width - 32) / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categories: {
    //padding: 16
  },
  categoryItem: {
    width: itemWidth,
    //width: itemWidth,
    // padding: 8,
  },
  leftItem: {
    paddingRight: 8,
  },
  listContainer: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  rightItem: {
    paddingLeft: 8,
  },
  divider: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 20,
  },
})

export default styles;
