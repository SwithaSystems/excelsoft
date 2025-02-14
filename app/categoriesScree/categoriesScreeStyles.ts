import { StyleSheet,Dimensions } from 'react-native';



const { width } = Dimensions.get('window');
const itemWidth = (width ) / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryItem: {
    width: "80%",
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  leftItem: {
    marginRight: 8,
  },
  listContainer: {
    padding: 8,
    paddingTop: 0,
    
  },
  rightItem: {
    marginLeft: 8,
  },
  divider: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
})

export default styles;
