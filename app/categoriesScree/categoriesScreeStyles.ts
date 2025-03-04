import { StyleSheet,Dimensions } from 'react-native';



const { width } = Dimensions.get('window');
const itemWidth = (width-32 ) / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 16,
    paddingTop: 8,
    
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
    //marginHorizontal: -8,
    
  },
})

export default styles;
