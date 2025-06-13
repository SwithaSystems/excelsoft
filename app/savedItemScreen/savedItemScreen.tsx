import { SAVED_ITEMS_SCREEN_TITLE } from './../config/stringLiterals';
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
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
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import SaveItemFav from "../cartScreen/components/saveItem_fav";
import PageLayout from "../pageLayoutProps";

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
  // const insets = useSafeAreaInsets();
  // const footerHeight =
  //   60 +
  //   (Platform.OS === "ios"
  //     ? insets.bottom
  //     : insets.bottom > 0
  //     ? insets.bottom
  //     : 10);
  return (
    // <SafeAreaView style={[globalStyles.safeAreaContainer, { paddingTop: 0 }]}>
    <PageLayout
      scrollable
      hasFooter
      hasHeader
      footerComponent={<Footer activeTab="saved" />}
      headerComponent={<Header headerText={SAVED_ITEMS_SCREEN_TITLE} />}
    >
      <View style={globalStyles.container}>
        {/* <Header headerText={SAVED_ITEMS_SCREEN_TITLE} /> */}
        <ScrollView>
          <View style={[
            // globalStyles.sectionContent,
             globalStyles.pt_0]}>
            {savedItems.map((item: any) => {
              return (
                <SaveItemFav
                  // footerBtnText="Move to Cart"
                  handleDelete={() => handleDelete(item)}
                  // onFooterAction={() => handleMoveToCart(item)}
                  key={item.id}
                  cartItem={item}
                  isSavedItem="true"
                />
              );
            })}
            {savedItems.length === 0 && (
              <>
                <View style={styles.emptyCartContainer}>
                  <Ionicons
                    name="cart"
                    size={98}
                    color={colors.placeholdergrey}
                    style={styles.cartIcon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.emptyTitle}>Your page is empty</Text>
                    <Text style={styles.emptySubtitle}>
                      No worries! You can check our products{" "}
                      <TouchableOpacity
                        onPress={() => redirectToPage(containers.homeScreen)}
                      >
                        <Text style={styles.hereText}>here.</Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
      {/* <View
        style={[
          styles.footer,
          {
            height: footerHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          },
        ]}
      ></View> */}
    </PageLayout>
    /* <Footer activeTab="saved" /> 
      </View>{" "}
    </SafeAreaView> */
  );
};

export default savedItemScreen;
