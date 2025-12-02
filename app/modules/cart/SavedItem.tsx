import { SAVED_ITEMS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import Footer from "@/app/components/Footer";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromSavedItems,
  moveToCart,
} from "../../../store/slices/savedItemsSlice";
import { addToCart } from "../../../store/slices/cartSlice";
import { router } from "expo-router";
import { selectSavedItems } from "@/store/selectors/savedItemsSelectors";
import { Image } from "react-native-elements";
import Button from "@/app/components/commonComponents/Button";
import colors from "../../../constants/colors";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../components/ProductCard";
import SaveItemFav from "./Components/SaveItem_fav";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import styles from "./SavedItemStyles";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

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

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={SAVED_ITEMS_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? (
    <FooterWeb />
  ) : (
    <Footer activeTab="saved" />
  );

  return (
    <LayoutComponent
      hasHeader
      hasFooter
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      scrollable
      hasSidebar={isTabOrDesktop}
      userSidebar={true}
    >
      <View style={globalStyles.container}>
              {isTabOrDesktop && (
        <Text
          style={{
            fontSize: 28,
            fontWeight: "300",
            marginBottom: 20,
            color: colors.black,
            textAlign: "center",
            width: "100%",
            // marginTop: 20,
          }}
        >
          {SAVED_ITEMS_SCREEN_TITLE}
        </Text>
      )}
        <ScrollView>
          <View style={[globalStyles.pt_0]}>
            {savedItems.map((item: any) => {
              return (
                <SaveItemFav
                  handleDelete={() => handleDelete(item)}
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
    </LayoutComponent>
  );
};

export default savedItemScreen;
