import { SAVED_ITEMS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import Footer from "@/app/components/Footer";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromSavedItems,
  refreshSavedItem,
} from "../../../store/slices/savedItemsSlice";
import { CartItemInterface } from "../../../store/slices/cartSlice";
import { selectSavedItems } from "@/store/selectors/savedItemsSelectors";
import colors from "../../../constants/colors";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { Ionicons } from "@expo/vector-icons";
import SaveItemFav from "./Components/SaveItem_fav";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import styles from "./SavedItemStyles";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { ProductsAPI } from "@/services/productService";

const savedItemScreen = () => {
  const dispatch = useDispatch();
  const savedItems = useSelector(selectSavedItems);

  // console.log("saved Items before", savedItems);

  const handleDelete = (item: CartItemInterface) => {
    dispatch(removeFromSavedItems(item.id));
  };

  const isWeb = Platform.OS === "web";

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={SAVED_ITEMS_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <Footer activeTab="saved" />
  );

  useEffect(() => {
    const validateAndRefreshSavedItems = async () => {
      if (savedItems.length === 0) return;

      try {
        const itemIds = savedItems
          .map((item: CartItemInterface) => item._id ?? null)
          .filter((id: string | null) => id !== null);

        if (itemIds.length === 0) return;

        const products = await ProductsAPI.getProductBy_multipleID(itemIds);
        const productMap = new Map(
          products.map((product) => [product._id, product])
        );

        savedItems.forEach((item: CartItemInterface) => {
          const product = productMap.get(item._id);

          if (!product) {
            dispatch(removeFromSavedItems(item.id));
            return;
          }

          dispatch(refreshSavedItem({ _id: item._id, data: product }));
        });
      } catch (error) {
        console.error("Error validating saved items:", error);
      }
    };

    validateAndRefreshSavedItems();
  }, []);

  return (
    <LayoutComponent
      hasHeader
      hasFooter
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      scrollable
      hasSidebar={isWeb}
      userSidebar={true}
    >
      <View style={globalStyles.container}>
              {isWeb && (
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
            {savedItems.map((item: CartItemInterface) => {
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
