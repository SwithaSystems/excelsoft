import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DisplayPrice from "../../../components/DisplayPrice";
import { Feather, Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { globalStyles } from "@/assets/styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  addToSavedForLaterItems,
  updateSavedForLaterItemQuantity,
  removeFromSavedForLaterItems,
} from "../../../../store/slices/savedForLaterSlice";
import { removeFromCart } from "../../../../store/slices/cartSlice";
import { updateQuantity } from "../../../../store/slices/cartSlice";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import savedItemScreen from "../SavedItem";

const SaveItemFav = (props) => {
  const item = props.cartItem;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => [...state.cart.items]);
  const savedForLaterItems = useSelector(
    (state) => state.savedForLaterItems.items
  );
  console.log("props", props);

  const getImageSource = () => {
    // Check if item has image as a string (direct URL)
    if (item.image && typeof item.image === "string") {
      return { uri: item.image };
    }
    // Check if item has image array (from cart items)
    else if (item.image && Array.isArray(item.image) && item.image.length > 0) {
      return { uri: item.image[0] };
    }
    // Check if item has imageUrl (from other screens)
    else if (item.imageUrl) {
      // Handle both require() numbers and URL strings
      return typeof item.imageUrl === "number"
        ? item.imageUrl // require() asset
        : { uri: item.imageUrl }; // URL string
    }
    // Fallback
    return null;
  };

  const getItemName = () => {
    return item.name || item.title || "Unknown Item";
  };

  const handleSaveItem = (saveItem) => {
    if (saveItem) {
      const itemToSave = cartItems.find((item) => item.id === saveItem.id);
      if (itemToSave) {
        dispatch(addToSavedForLaterItems(itemToSave));
        dispatch(removeFromCart(itemToSave.id));
      }
    }
  };
  const increaseQuantity = (itemId, currentQuantity) => {
    if (props.isSavedItem) {
      dispatch(
        updateSavedForLaterItemQuantity({
          id: itemId,
          quantity: currentQuantity + 1,
        })
      );
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: currentQuantity + 1 }));
    }
  };

  const decreaseQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      if (props.isSavedItem) {
        dispatch(
          updateSavedForLaterItemQuantity({
            id: itemId,
            quantity: currentQuantity - 1,
          })
        );
      } else {
        dispatch(updateQuantity({ id: itemId, quantity: currentQuantity - 1 }));
      }
    } else {
      if (props.isSavedItem) {
        dispatch(removeFromSavedForLaterItems(itemId));
      } else {
        dispatch(removeFromCart(itemId));
      }
    }
  };

  const handleAdd = (itemId) => {
    if (props.isSavedItem) {
      dispatch(updateSavedForLaterItemQuantity({ id: itemId, quantity: 1 }));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: 1 }));
    }
  };

  return (
    <>
      <View style={[styles.cartItem /*props?.itemContainerStyle*/]}>
        <TouchableOpacity
          onPress={() =>
            redirectToPage(containers.productDetailScreen, {
              productId: item.id,
              from: "savedItemScreen",
            })
          }
        >
          <View style={styles.cartItemContent}>
            <View style={styles.cartItemImageContainer}>
              {getImageSource() ? (
                <Image source={getImageSource()} style={styles.itemImage} />
              ) : (
                <View
                  style={[
                    styles.itemImage,
                    { backgroundColor: colors.placeholdergrey },
                  ]}
                />
              )}
            </View>
            {props?.hideActions ? (
              <>
                <View style={[globalStyles.pl_3, { justifyContent: "center" }]}>
                  <Text style={globalStyles.h6}>
                    {getItemName()}
                    {props.showStockStatus && (
                      <Text style={styles.stockStatus}>
                        {props.stockAvailable ? "In Stock" : "No Stock"}
                      </Text>
                    )}
                  </Text>
                  <Text style={globalStyles.h6}>Qty: {item.quantity}</Text>
                  <Text style={globalStyles.h6}>
                    <DisplayPrice
                      price={item.price}
                      originalPrice={item.originalPrice}
                    />
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.itemDetails}>
                <DisplayPrice
                  price={item.price}
                  originalPrice={item.originalPrice}
                />
                <Text style={styles.itemName}>
                  {getItemName()}
                  {props.showStockStatus && (
                    <Text style={styles.stockStatus}>
                      {props.stockAvailable ? "In Stock" : "No Stock"}
                    </Text>
                  )}
                </Text>
                <View style={styles.quantityContainer}>
                  {/* <View style={styles.quantityActionContainer}>
                    {item.quantity && item.quantity > 0 ? (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            decreaseQuantity(item.id, item.quantity)
                          }
                        >
                          <View
                            style={[styles.quantityActionBtn, styles.minusBtn]}
                          >
                            <Feather
                              name="minus"
                              size={14}
                              color={colors.darkGray}
                            />
                          </View>
                        </TouchableOpacity>
                        <View style={styles.quantityText}>
                          <Text>{item.quantity}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            increaseQuantity(item.id, item.quantity)
                          }
                        >
                          <View
                            style={[styles.quantityActionBtn, styles.plusBtn]}
                          >
                            <Feather
                              name="plus"
                              size={14}
                              color={colors.darkGray}
                            />
                          </View>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <></>
                      // <Button
                      //   style={{ paddingVertical: 10 }}
                      //   onPress={() => {
                      //     handleAdd(item.id);
                      //   }}
                      //   title="Add"
                      // />
                    )}
                  </View> */}
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Deleting item", item);
                      props.handleDelete(item);
                    }}
                  >
                    <Ionicons name="trash-outline" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
                {/* <TouchableOpacity
                onPress={() => {
                  if (props.onFooterAction) {
                    props.onFooterAction(item);
                  } else {
                    handleSaveItem(item);
                  }
                }}
              >
                <Text style={styles.saveLaterBtn}>
                  {props.footerBtnText || "Save for Later"}
                </Text>
              </TouchableOpacity> */}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  stockStatus: {
    fontStyle: "italic",
    fontSize: 14,
    fontWeight: 500,
    color: colors.secondaryText,
    marginLeft: 4,
    textAlign: "right",
  },
  cartItem: {
    //paddingHorizontal: 16,
    //marginBottom: 8,
    paddingBottom: 16,
  },
  cartItemContent: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
  },
  cartItemImageContainer: {
    justifyContent: "center",
    height: 136,
    //width: 20,
  },
  itemImage: {
    width: 140,
    //aspectRatio: 1.5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: "100%",
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "space-between",
    marginBottom: 6,
  },
  quantityActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    borderRadius: 4,
    backgroundColor: colors.lightgrey,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  quantityActionBtn: {
    flexDirection: "row",
    width: 30,
    height: 30,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    color: colors.darkGray,
    backgroundColor: colors.white,
  },
  plusBtn: {
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
  minusBtn: {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
  quantityText: {
    width: 30,
    textAlign: "center",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  itemPrice: {
    fontSize: 16,
    color: "gray",
  },
  saveLaterBtn: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontSize: 12,
    marginBottom: 4,
  },
});
export default SaveItemFav;
