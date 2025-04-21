import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
      padding: 16,
      backgroundColor: colors.white,
    },
  text: {
    fontSize: 12,
    color: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: '#000',
  },
  subCategory: {
    flexDirection: "row",
    justifyContent:"space-between",
    borderRadius: 30,
    marginBottom: 16,
  },

  subCategoryNames: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 5,  
  },

  activeSubCategory: {
    backgroundColor: colors.primary,  
  },
  subCategoryNameText: {
    color: colors.black,  
  },

  activeSubCategoryText: {
    color: colors.white,  
    fontWeight: "bold",
  },
  welcomeText:{
    fontSize: 20,
    marginBottom: 16,
  },
});

export default styles;
