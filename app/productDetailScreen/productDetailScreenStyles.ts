import { StyleSheet, Dimensions } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginLeft:80
  },
  imageContainer:{
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:16
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.mediumGray,
    lineHeight: 20,
    marginBottom: 24,
  },
  colorSection: {
    marginBottom: 24,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  selectedColorOption: {
    borderColor: colors.primary,
  },
  quantitySection: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 38,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
  },
  reviewsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewTextShort: {
    fontSize: 14,
    color: colors.black,
    fontWeight:'bold',
    lineHeight: 20,
  },
  reviewText: {
    fontSize: 14,
    color: colors.mediumGray,
    lineHeight: 20,
  },
  seeMoreButton: {
    alignItems: 'center',
    padding: 16,
  },
  seeMoreText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  }
});

export default styles;
