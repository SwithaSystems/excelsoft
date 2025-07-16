import { Dimensions, StyleSheet } from 'react-native';
import colors from '../config/colors';

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
  // offerBanner: {
  //     backgroundColor: colors.bannerPurple,
  //     borderRadius: 20,
  //     padding: 20,
  //     alignItems: "center",
  //     //height: 230,
  //     width: "100%",
  //   },
    bannerTitle: {
      color: colors.white,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    bannerDiscount: {
      color: colors.white,
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 10,
    },
    bannerText: {
      color: colors.white,
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
    },
    banner:{
      width: '100%',
      height: 170,
    },
    exclusiveText:{
      marginLeft: 20,
      marginTop: 20,
      fontSize: 18,
      fontWeight:"bold",
      color: colors.bannerYellow,
    },
    tagsRow:{
      flexDirection: 'row',
      marginLeft: 20,
      marginTop: 30,
      gap: 20,
    },
    blackTag:{
      backgroundColor: colors.black,
      borderRadius: 5,
    },
    redTag:{
      backgroundColor: colors.error,
      borderRadius: 5,
    },
    tagText:{
      color: colors.white,
      fontSize: 18,
      marginHorizontal: 6,
      marginVertical: 4,
    },
    categoryContainer:{
      marginVertical: 15,
      alignSelf: 'flex-start',
      backgroundColor: colors.white,
      marginHorizontal: 20,
      borderRadius: 5,
    },
    categoryText:{
      color: colors.black,
      padding: 5,
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: 1,
    },
});

export default styles;
