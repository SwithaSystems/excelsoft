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
  offerBanner: {
      backgroundColor: "#2E2A5C",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      //height: 230,
      width: "100%",
    },
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
});

export default styles;
