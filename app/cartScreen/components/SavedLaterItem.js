import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CartItem from "./CartItem";

function SavedLaterItem(props) {
  const items = props.savedForLaterItems;
  return (
    <>
      <View>
        <Text style={props.sectionHeadingStyle || styles.summaryText}>
          Saved for Later
        </Text>
        {items.map((eactItem) => {
          return (
            <CartItem
              itemContainerStyle={styles.itemContainerStyle}
              key={eactItem.id}
              cartItem={eactItem}
              handleDelete={props.handleDelete}
              footerBtnText="Move to Cart"
              onFooterAction={() => props.handleMoveToCart(eactItem)}
              stockAvailable={props.stockAvailable?.[eactItem.id]||0}
              isSavedItem={true}
            />
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  summaryText: {
    fontSize: 24,
    marginBottom: 16,
  },
  itemContainerStyle: {
    paddingHorizontal: 20,
  },
});
export default SavedLaterItem;
