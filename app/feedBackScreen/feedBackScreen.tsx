import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import styles from "./feedBackScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductStars from "@/components/ProductStars";

const feedBackScreen = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);

  const handleStarRatingPress = (newRating: any) => {
    setRating(newRating);
  };

  const handleAddImagePress = () => {
    console.log("Add image pressed");
  };

  return (
    <View style={globalStyles.container}>
      <Header headerText="Feedback" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>What is your Rating?</Text>
            <ProductStars rating={rating} needAction={true} />
            {/* <StarRating
              maxStars={5}
              rating={rating}
              fullStarColor={"gold"} // Customize as needed
              emptyStarColor={"gray"} // Customize as needed
              halfStarColor={"gold"} // Customize as needed
              starSize={30} // Adjust size as needed
              starStyle={{ marginHorizontal: 5 }} // Adjust spacing as needed
              selectedStar={(rating: any) => handleStarRatingPress(rating)}
            /> */}
          </View>
          <View style={styles.reviewInputContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Add Your Review"
              multiline={true}
              value={reviewText}
              onChangeText={setReviewText}
            />
          </View>

          <View style={styles.imagePickerContainer}>
            <Text>Would you like to add some pictures?</Text>
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handleAddImagePress}
            >
              <Ionicons name="add" size={30} color="gray" />
            </TouchableOpacity>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.image}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Add Your Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default feedBackScreen;
