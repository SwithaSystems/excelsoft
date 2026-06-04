import { SAVED_ADDRESS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import styles from "./SavedAddressStyles";
import Button from "@/app/components/commonComponents/Button";
import { clearNavigationStack } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Address, addressService } from "@/services/addressService";
import { useAppContext } from "@/context/AppContext";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import AddressItem from "../../components/AddressItem";
import NoContentFound from "@/app/components/NoContentFound";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

const savedAddressScreen = () => {
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const { setSelectedAddress } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAllAddress();
        setAddressData(response);
        // console.log("Shipping addresses:", response);
      } catch (err) {
        console.error("Error fetching shipping addresses:", err);
      }
    };

    fetchAddresses();
  }, []);
  // console.log("shipping address saved address", addressData);

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await addressService.deleteAddress(itemToDelete.id);
        if (response.success) {
          setAddressData((prev) =>
            prev.filter((item) => item._id !== itemToDelete.id)
          );
        } else {
          alert("Failed to delete address.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Something went wrong.");
      }
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const handleEdit = (item: Address) => {
    // setSelectedAddress(item);
    clearNavigationStack(containers.addAddressScreen, {
      edit_address: JSON.stringify(item),
    });
  };

  const handleDelete = (item: Address) => {
    setIsModalVisible(true);
    setItemToDelete({ id: item._id });
  };

  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isDesktopWeb = isWeb && !isMobile;

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={SAVED_ADDRESS_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;
  const sortedAddresses = [...addressData].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault)
  );

  return (
    <LayoutComponent
      scrollable={false}
      hasHeader
      hasFooter={isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
      userSidebar={true}
    >
      <View style={[globalStyles.container, styles.pageContainer]}>
        <View style={[styles.contentContainer, isDesktopWeb && styles.contentContainerWeb]}>
          {isDesktopWeb ? (
            <>
              <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>Saved Address</Text>
                <View style={styles.addButtonContainer}>
                  <Button
                    title="Add New Address"
                    onPress={() => {
                      clearNavigationStack(containers.addAddressScreen);
                    }}
                  />
                </View>
              </View>

              {addressData.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <NoContentFound message="No saved address found" />
                </View>
              ) : (
                <FlatList
                  data={sortedAddresses}
                  renderItem={({ item }) => (
                    <View style={styles.rowItem}>
                      {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
                      <AddressItem item={item} onEdit={handleEdit} onDelete={handleDelete} />
                    </View>
                  )}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={styles.addressList}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </>
          ) : (
            <>
              {addressData.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <NoContentFound message="No saved address found" />
                </View>
              ) : (
                <FlatList
                  data={sortedAddresses}
                  renderItem={({ item }) => (
                    <AddressItem item={item} onEdit={handleEdit} onDelete={handleDelete} />
                  )}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={styles.addressList}
                  showsVerticalScrollIndicator={false}
                />
              )}
              <View style={styles.mobileButtonContainer}>
                <Button
                  title="Add New Address"
                  onPress={() => {
                    clearNavigationStack(containers.addAddressScreen);
                  }}
                />
              </View>
            </>
          )}

          <ConfirmationModal
            onClose={() => {
              setIsModalVisible(false);
            }}
            isModalVisible={isModalVisible}
            text="Are you sure you want to delete this address?"
            submitText="Delete Address"
            handleSubmit={confirmDelete}
            cancelText="Cancel"
            handleCancel={cancelDelete}
            title="Delete Address"
            isDestructive={true}
          />
        </View>
      </View>
    </LayoutComponent>
  );
};

export default savedAddressScreen;
