import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between items (16)

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  },
  listContainer: {
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  productItem: {
    width: itemWidth,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  leftItem: {
    marginRight: 8,
  },
  rightItem: {
    marginLeft: 8,
  },
});

export default styles;
