import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import styles from "./AppReviewScreenStyles"
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductStars from "@/components/ProductStars";
import Button from "@/components/commonComponents/Button";
import * as ImagePicker from "expo-image-picker";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { ProductsAPI } from "@/services/productService";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import colors from "../config/colors";

const appReviewScreen = () => {
    const [rating, setRating] = useState(0);
    
    return(
        <View style={styles.container}>
        <Header
            headerText="Add Your Review"
            secondaryBtnText="Discard"
            secondaryBtnCallBack={() => {
            redirectToPage(containers.userProfileScreenScreen);
            }}
        />

        <ScrollView>
        <View style={styles.ratingCategory}>
            <Text style = {styles.secondaryText}>Tell us about your expereince!</Text>
            <Text>Rate your site Experience</Text>
            <ProductStars
              starsContainer={{ justifyContent: "space-between" }}
              rating={rating}
              needAction={true}
              size={60}
              onChangeRating={setRating}
            />
        </View>
        <View style = {styles.selectCategory}>
            <Text>Tell us your feedback about</Text>
            <View style = {styles.chooseCategory}>
                <TextInput 
                    placeholder="Choose your category"
                    style = {styles.categoryText}
                />
                <Ionicons name="chevron-down-outline"
                          size = {24}
                          color={colors.primary}
                />
            </View>
        </View>
        <View style={styles.radioContainer}>
                <Text>Did any thing made you stop from your shopping?</Text>
                <TouchableOpacity style={styles.radioOption}>
                    <Ionicons name="radio-button-off"
                              size = {20}
                              color = {colors.primary}
                    />
                    <Text style = {styles.radioLabel}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.radioOption}>
                    <Ionicons name="radio-button-off"
                              size = {20}
                              color = {colors.primary}
                    />
                    <Text style = {styles.radioLabel}>No</Text>
                </TouchableOpacity>
        </View>       
        <View style={styles.addYourReview}>
            <Text>Do you want to talk more about your experience?</Text>
            <TextInput 
                        style = {styles.reviewText}
                        placeholder="Add your experience"
                        multiline
                        numberOfLines={8}
            />
        </View>

        <TouchableOpacity style={styles.submitButton}>
            <Text style = {styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
        </ScrollView>        
        </View>
    );
};

export default appReviewScreen;