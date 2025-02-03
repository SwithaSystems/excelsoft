import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Or your preferred icon library
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import colors from "../config/colors";

const CartScreen = () => {
  const similarProducts = [
    {
      id: 1,
      image: require("../../assets/baby-bicycle.png"), // Replace with your image paths
      name: "Blue Berries",
      price: 4.99,
    },
    {
      id: 2,
      image: require("../../assets/baby-bicycle.png"),
      name: "Camarosa",
      price: 6.99,
    },
  ];
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: require("../../assets/baby-bicycle.png"), // Replace with your image paths
      name: "Duck Toys",
      price: 10.0,
      originalPrice: 6.99,
      quantity: 1,
    },
    {
      id: 2,
      image: require("../../assets/baby-bicycle.png"),
      name: "Orange Juice",
      price: 3.0,
      quantity: 2,
    },
    {
      id: 3,
      image: require("../../assets/baby-bicycle.png"),
      name: "Whole Wheat Bread",
      price: 12.0,
      quantity: 1,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    setCartItems(cartItems.filter((item) => item.id !== itemToDelete.id));
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const SavedForItem = ({ item }) => (
    <View style={styles.savedItem}>
      <Image source={item.image} style={styles.savedItemImage} />
      <Text>{item.name}</Text>
      <TouchableOpacity style={styles.addBtn}>
        <Text style={{ color: "white" }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
  const SimilarProductItem = ({ item }) => (
    <View style={styles.similarProductItem}>
      <Image source={item.image} style={styles.similarProductImage} />
      <View style={styles.similarProductDetails}>
        <Text>{item.name}</Text>
        <Text>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={{ color: "white" }}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  const CartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemContent}>
        <View>
          <Image source={item.image} style={styles.itemImage} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemPrice}>
            ${item.price.toFixed(2)} {item.price.toFixed()}
          </Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.quantityContainer}>
            <Text>Qty: {item.quantity}</Text>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Ionicons name="trash-outline" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[globalStyles.container]}>
      <ScrollView>
        <Header headerText="Cart" />

        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {cartItems.map((eachCartItem) => {
            return <CartItem key={eachCartItem.id} item={eachCartItem} />;
          })}

          <View style={styles.orderSummary}>
            <Text style={styles.summaryText}>Order Details</Text>
            {/* Render items in the order summary */}
            {cartItems.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <Text>{item.name}</Text>
                <Text>{item.quantity}</Text>
                <Text>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.summaryTotal}>
              <Text>Total:</Text>
              <Text>${calculateTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.placeOrderButton}>
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.similarProductsContainer}>
            <Text style={styles.similarProductsTitle}>
              Similar products to your cart
            </Text>
            <FlatList
              data={similarProducts}
              renderItem={({ item }) => <SimilarProductItem item={item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true} // Make it horizontal
            />
          </View>
        </View>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>
                Are you sure you want to delete this? You can save this item for
                later too.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={confirmDelete}
                >
                  <Text style={{ color: "white" }}>Delete Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveForLaterButton}
                  onPress={cancelDelete}
                >
                  <Text>Save for later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light background color
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cartItem: {
    paddingHorizontal: 44,
    marginBottom: 10,
  },
  cartItemContent: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.lightgrey,
  },
  itemImage: {
    width: 140,
    marginRight: 15,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 16,
    color: "gray",
  },
  orderSummary: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  placeOrderButton: {
    backgroundColor: "skyblue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  placeOrderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  saveForLaterButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
  },

  savedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  savedItemImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  addBtn: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  similarProductsContainer: {
    marginTop: 20,
  },
  similarProductsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  similarProductItem: {
    width: 150, // Adjust width as needed
    marginRight: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    alignItems: "center", // Center content vertically
  },
  similarProductImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  similarProductDetails: {
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
});

export default CartScreen;
