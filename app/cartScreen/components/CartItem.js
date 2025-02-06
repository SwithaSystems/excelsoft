import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DisplayPrice from "../../../components/DisplayPrice";
import { Feather, Ionicons } from "@expo/vector-icons";
import colors from "@/app/config/colors";
import Button from "@/components/commonComponents/Button";
import { globalStyles } from "@/assets/styles/globalStyles";

function CartItem(props) {
  const item = props.cartItem;
  return (
    <>
      <View style={[styles.cartItem, props?.itemContainerStyle]}>
        <View style={styles.cartItemContent}>
          <View>
            <Image source={item.image} style={styles.itemImage} />
          </View>
          {props?.hideActions ? (
            <>
              <View
                style={[
                  globalStyles.pl_3,
                  { height: "100%", justifyContent: "center" },
                ]}
              >
                <Text style={globalStyles.h6}>{item.name}</Text>
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
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.quantityContainer}>
                <View style={styles.quantityActionContainer}>
                  {item.quantity && item.quantity > 0 ? (
                    <>
                      <TouchableOpacity onPress={() => alert("-")}>
                        <Text
                          style={[styles.quantityActionBtn, styles.minusBtn]}
                        >
                          <Feather name="minus" size={14} color={"#646464"} />
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => alert("+")}>
                        <Text
                          style={[styles.quantityActionBtn, styles.plusBtn]}
                        >
                          <Feather name="plus" size={14} color={"#646464"} />
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Button
                      style={{ paddingVertical: 10 }}
                      onPress={() => {}}
                      title="Add"
                    />
                  )}
                </View>
                <TouchableOpacity onPress={() => props.handleDelete(item)}>
                  <Ionicons name="trash-outline" size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => alert(JSON.stringify(item))}>
                <Text style={styles.saveLaterBtn}>Save for Later</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  cartItem: {
    paddingHorizontal: 44,
    marginBottom: 16,
  },
  cartItemContent: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.lightgrey,
  },
  itemImage: {
    width: 140,
    //height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
    shadowColor: colors.black,
    borderRadius: 4,
    backgroundColor: "#EDEDED",
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
    color: "#646464",
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
  },
});
export default CartItem;
