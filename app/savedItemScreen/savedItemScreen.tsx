import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import styles from "./savedItemScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import CartItem from "../cartScreen/components/CartItem";
import Footer from "@/components/Footer";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromSavedItems,
  moveToCart,
} from "../../store/slices/savedItemsSlice";
import { addToCart } from "../../store/slices/cartSlice";
import { router } from "expo-router";
import { selectSavedItems } from "@/store/selectors/savedItemsSelectors";
import { Image } from "react-native-elements";
import Button from "@/components/commonComponents/Button";
import colors from "../config/colors";

const savedItemScreen = () => {
  const dispatch = useDispatch();
  const savedItems = useSelector(selectSavedItems);

  console.log("saved Items before", savedItems);

  const handleMoveToCart = (item: any) => {
    console.log("item", item);
    console.log("hi from handlemoveto cart");
    dispatch(addToCart(item));
    dispatch(moveToCart(item.id));
    console.log("saved Items", savedItems);
  };

  const handleDelete = (item: any) => {
    dispatch(removeFromSavedItems(item.id));
  };
  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={globalStyles.container}>
      <Header headerText="Saved Items" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {savedItems.map((eachItem: any) => {
            return (
              <CartItem
                footerBtnText="Move to Cart"
                handleDelete={() => handleDelete(eachItem)}
                onFooterAction={() => handleMoveToCart(eachItem)}
                key={eachItem.id}
                cartItem={eachItem}
                isSavedItem="true"
              />
            );
          })}
          {savedItems.length === 0 && (
            <>
              <View
                style={[
                  styles.container,
                  globalStyles.container,
                  { paddingHorizontal: 20 },
                ]}
              ></View>
              <Image source={require("../../assets/emptycart.png")} />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 48,
                  fontSize: 24,
                  fontWeight: "600",
                  paddingBottom: 16,
                }}
              >
                Uh-oh! You have no saved Items! Would you like to explore some
                products?
              </Text>
              <Button
                title="Start Shopping"
                onPress={() => router.back()}
                style={styles.button}
                textStyle={styles.text}
              ></Button>
            </>
          )}
        </View>
      </ScrollView>
      <Footer navigation={router} activeTab="saved" />
    </View>
    </SafeAreaView>
  );
};

export default savedItemScreen;
