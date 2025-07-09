import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import styles from "./savedCardsStyles";

const SavedCards = () => {
  const [cardsData, setCardsData] = useState([
    {
      id: "1",
      name: "Katleen M. Dennis",
      number: "1234",
      cvv: "123",
      expiry: "12/24",
    },
    {
      id: "2",
      name: "Katleen M. Dennis",
      number: "9874",
      cvv: "123",
      expiry: "11/25",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Payments</Text>

      <Text style={styles.subHeader}>Saved Cards</Text>

      <FlatList
        data={cardsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardBox}>
            <View>
              <Text style={styles.label}>
                <Text style={styles.bold}>Card Holder Name:</Text>{" "}
                {item.name}
              </Text>
              <Text style={styles.label}>
                <Text style={styles.bold}>Card Number:</Text> **** **** ****{" "}
                {item.number}
              </Text>
              <Text style={styles.label}>
                <Text style={styles.bold}>CVV:</Text> {item.cvv}
              </Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Another Card</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SavedCards;
