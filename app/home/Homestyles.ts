import { StyleSheet, Dimensions } from 'react-native';
import colors from "../config/colors";


const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  logo:{
    width:24,
    height:24,
  },
  welcomeText:{
alignSelf:'flex-end'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderColor:colors.primary,
    borderWidth:0.5,
    borderRadius: 25,
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
  },
  banner: {
    height: 150,
    backgroundColor: '#3B4FB8',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  productCard: {
    width: (width - 48) / 2,
    margin: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});
