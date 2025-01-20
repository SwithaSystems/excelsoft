import React from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import homeStyles from './Homestyles';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import CategoryItem from '../../components/CategoryItem';
import colors from "../config/colors";

const categories = [
  { id: '1', title: 'Discount', imageUrl: require('../../assets/discount.png') },
  { id: '2', title: 'All', imageUrl: require('../../assets/all.png') },
  { id: '3', title: 'Groceries', imageUrl: require('../../assets/groceries.png') },
  { id: '4', title: 'Baby & Kids', imageUrl: require('../../assets/baby.png') },
  { id: '5', title: 'Fruits', imageUrl: require('../../assets/fruits.png') },
];

const recommendedProducts = [
  {
    id: '1',
    title: 'Greek Yogurt',
    rating: 4.8,
    reviews: 180,
    price: 4.99,
    imageUrl: require('../../assets/yogurt.jpg'),
  },
  {
    id: '2',
    title: 'Baby Stroller',
    rating: 4.9,
    reviews: 220,
    price: 120,
    originalPrice: 180,
    imageUrl: require('../../assets/stroller.jpg'),
  },
];

const exclusiveOffers = [
  {
    id: '1',
    title: 'Baby Stroller',
    rating: 4.7,
    reviews: 120,
    price: 120,
    originalPrice: 180,
    saleEndsAt: '02:48:26',
    discount: '20%',
    image: require('../../assets/stroller.jpg')
  },
  {
    id: '2',
    title: 'Bananas',
    rating: 4.5,
    reviews: 130,
    price: 8,
    originalPrice: 10,
    saleEndsAt: '01:30:00',
    discount: '15%',
    image: require('../../assets/banana.png')
  }
];

const bestSellers = [
  {
    id: '1',
    title: 'Bananas',
    rating: 4.9,
    reviews: 300,
    image: require('../../assets/banana.png')
  },
  {
    id: '2',
    title: 'Chicken Breast',
    rating: 4.8,
    reviews: 250,
    image: require('../../assets/chicken.png')
  },
  {
    id: '3',
    title: 'Wheat',
    rating: 4.7,
    reviews: 280,
    image: require('../../assets/wheat.png')
  }
];

const featuredProducts = [
  {
    id: '1',
    title: 'Brown Teddy Bear',
    description: '3 Feet, Soft and Fluffy',
    image: require('../../assets/teddy.png')
  },
  {
    id: '2',
    title: 'Anchovies',
    description: 'Rich in omega-3',
    image: require('../../assets/fish.png')
  }
];

const HomePage = ({ navigation }:any) => {
  const renderBanner = () => (
    <View style={styles.banner}>
      <Text style={styles.bannerTitle}>New Year Eve Special Discount!</Text>
      <Text style={styles.bannerDiscount}>40-60% Discount</Text>
      <Text style={styles.bannerText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
      <TouchableOpacity style={styles.shopNowButton}>
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExclusiveOffers = () => (
    <View>
      <Text style={styles.sectionTitle}>Exclusive Offers</Text>
      <FlatList
        horizontal
        data={exclusiveOffers}
        renderItem={({ item }) => (
          <View style={styles.offerCard}>
            <Image source={item.image} style={styles.offerImage} resizeMode='cover' />
            <View style={styles.offerDetails}>
              <Text style={styles.offerTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>
                <Text>{item.rating} ★</Text>
                <Text>({item.reviews})</Text>
              </View>
              
              <View style={styles.saleContainer}>
                <Text style={styles.saleText}>Sale</Text>
                <Text style={{color:colors.primary}}>{item.saleEndsAt}</Text>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.originalPrice}>${item.originalPrice}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const renderBestSellers = () => (
    <View>
      <Text style={styles.sectionTitle}>Best Sellers</Text>
      <FlatList
        horizontal
        data={bestSellers}
        renderItem={({ item }) => (
          <View style={styles.bestSellerCard}>
            <Image source={item.image} style={styles.bestSellerImage} />
            <Text style={styles.bestSellerTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <Text>{item.rating} ★</Text>
              <Text>({item.reviews})</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const renderFeaturedProducts = () => (
    <View>
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        horizontal
        data={featuredProducts}
        renderItem={({ item }) => (
          <View style={styles.featuredCard}>
            <Image source={item.image} style={styles.featuredImage} />
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <Text style={styles.featuredDescription}>{item.description}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={homeStyles.container}>
      <ScrollView>
        {/* Header */}
        <View style={{ ...homeStyles.header, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}> 
          <Image source={require('../../assets/brandlogo.png')} style={homeStyles.logo} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 8 }}>Hello, User</Text>
            <Ionicons name="person-circle-outline" size={24} color="#000" />
          </View>
        </View>

        {/* Search Bar */}
        <View style={homeStyles.searchContainer}>
          <TextInput
            style={homeStyles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.placeholderTextColor}
          />
          <Ionicons name="search" size={20} color = {colors.primary} />

        </View>

        {/* Categories */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryItem
              title={item.title}
              imageUrl={item.imageUrl}
              onPress={() => navigation.navigate('Category', { category: item })}
            />
          )}
          style={homeStyles.categoriesContainer}
        />

        {/* Banner */}
        {renderBanner()}

         {/* Recommended Products */}
         <Text style={styles.sectionTitle}>Recommended for You</Text>
        <View style={homeStyles.productGrid}>
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onPress={() =>
                navigation.navigate('ProductDetails', { product: product })
              }
            />
          ))}
        </View>

        {/* Exclusive Offers */}
        {renderExclusiveOffers()}

        {/* Best Sellers */}
        {renderBestSellers()}

        {/* Featured Products */}
        {renderFeaturedProducts()}

      </ScrollView>

      {/* Footer */}
      <Footer navigation={navigation} activeTab="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#2E2A5C',
    borderRadius: 20,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    height: 230,
    width: 408,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  bannerDiscount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bannerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  shopNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  offerCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerImage: {
    width: 190,
    height: 320,
  },
  offerDetails: {
    padding: 10,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    marginRight: 5,
    color:colors.primary
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  saleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  saleText: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: 4,
    borderRadius: 4,
    marginRight: 5,
  },
  discountText: {
    color: colors.primary,
    marginLeft: 5,
  },
  bestSellerCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: 'white',
    padding: 10,
  },
  bestSellerImage: {
    width: '100%',
    height: 120,
  },
  bestSellerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  featuredCard: {
    width: 180,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  featuredImage: {
    width: 240,
    height: 145,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 15,
  },
});

export default HomePage;
