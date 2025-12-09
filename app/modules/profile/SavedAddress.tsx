import { SAVED_ADDRESS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import styles from "./SavedAddressStyles";
import Button from "@/app/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
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
        console.log("Shipping addresses:", response);
      } catch (err) {
        console.error("Error fetching shipping addresses:", err);
      }
    };

    fetchAddresses();
  }, []);
  console.log("shipping address saved address", addressData);

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
    redirectToPage(containers.addAddressScreen, {
      edit_address: JSON.stringify(item),
    });
  };

  const handleDelete = (item: Address) => {
    setIsModalVisible(true);
    setItemToDelete({ id: item._id });
  };

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={SAVED_ADDRESS_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      scrollable={false}
      hasHeader
      hasFooter={isTabOrDesktop}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isTabOrDesktop}
      userSidebar={true}
    >
      <View style={globalStyles.container}>
        <ScrollView>
          <FlatList
            ListHeaderComponent={
              <>
                {addressData.length === 0 ? (
                  <View
                    style={{
                      flex: 1,
                      padding: 16,
                    }}
                  >
                    <NoContentFound message="No saved address found" />
                  </View>
                ) : (
                  <View style={styles.centeredContainer}>
                    <View
                      style={[
                        globalStyles.pt_0,
                        {
                          width: 350,
                        },
                      ]}
                    >
                      <Text style={styles.sectionTitle}>Default Address</Text>
                      <FlatList
                        data={addressData.filter(
                          (address) => address.isDefault
                        )}
                        renderItem={({ item }) => (
                          <AddressItem
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        )}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.addressList}
                      />

                      <Text style={styles.sectionTitle}>Address</Text>
                      <FlatList
                        data={addressData.filter(
                          (address) => !address.isDefault
                        )}
                        renderItem={({ item }) => (
                          <AddressItem
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        )}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.addressList}
                      />
                    </View>
                  </View>
                )}
                <ConfirmationModal
                  onClose={() => {
                    setIsModalVisible(false);
                  } }
                  isModalVisible={isModalVisible}
                  text="Are you sure you want to delete this address?"
                  submitText="Delete Address"
                  handleSubmit={confirmDelete}
                  cancelText="Cancel"
                  handleCancel={cancelDelete} 
                  title="Delete Address"                
                />
              </>
            }
            data={[]} // No actual data here — just to use FlatList as scroll container
            renderItem={null}
          />
        </ScrollView>

        <View style={styles.addressList}>
          <Button
            title="Add New Address"
            onPress={() => {
              redirectToPage(containers.addAddressScreen);
            }}
          />
        </View>
      </View>
    </LayoutComponent>
  );
};

export default savedAddressScreen;
