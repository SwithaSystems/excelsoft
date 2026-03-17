import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import styles from "./AdminStoreInformationStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { utilitiesStyles } from "@/assets/styles/utilitiesStyles";
import { Picker } from "@react-native-picker/picker";
import Button from "@/app/components/commonComponents/Button";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { STORE_DETAILS_SCREEN_TITLE } from "@/constants/stringLiterals";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const AdminStoreInformation = () => {
  const [storeName, setStoreName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");

  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={STORE_DETAILS_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter={isWeb}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
      scrollable={true}
      hideNavItems={true}
    >
      <View
        style={[
          styles.contentContainer,
          isWeb && webStyles.contentWidth,
          isMobileWeb && webStyles.mobileWebContentWidth,
        ]}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.pageTitle}>Store information</Text>
          <Text style={styles.pageSubtitle}>
            Update store details shown to customers and used for admin operations.
          </Text>

          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>Store Name</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Store Name"
                value={storeName}
                onPress={() => {}}
                setValue={setStoreName}
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>Contact Details</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Contact Details"
                value={contactDetails}
                onPress={() => {}}
                setValue={setContactDetails}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={[utilitiesStyles.flex_1, styles.timeSection]}>
            <Text style={globalStyles.userInputLabel}>Opening hours</Text>
            <View style={[globalStyles.timeContainer, styles.timeContainer]}>
              <TextInput
                style={globalStyles.timeInput}
                placeholder="HH"
                keyboardType="numeric"
                maxLength={2}
                value={hours}
                onChangeText={setHours}
              />
              <Text>:</Text>
              <TextInput
                style={globalStyles.timeInput}
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
                value={minutes}
                onChangeText={setMinutes}
              />

              <View style={styles.pickerWrap}>
                {!isWeb && (
                  <Text style={styles.pickerDisplayText}>{period.toUpperCase()}</Text>
                )}
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={colors.black}
                  style={styles.pickerChevron}
                  pointerEvents="none"
                />
                <Picker
                  selectedValue={period}
                  style={[
                    globalStyles.picker_sm,
                    styles.pickerSm,
                    !isWeb && styles.pickerSmMobile,
                    !isWeb && { width: 110 },
                  ]}
                  itemStyle={styles.pickerItem}
                  mode="dropdown"
                  dropdownIconColor={colors.black}
                  onValueChange={(itemValue) => setPeriod(itemValue)}
                >
                  <Picker.Item
                    style={[globalStyles.pickerValue_sm, styles.pickerItem]}
                    label="AM"
                    value="am"
                  />
                  <Picker.Item
                    style={[globalStyles.pickerValue_sm, styles.pickerItem]}
                    label="PM"
                    value="pm"
                  />
                </Picker>
              </View>
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>Address</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Address"
                value={storeAddress}
                onPress={() => {}}
                multiline={true}
                setValue={setStoreAddress}
              />
            </View>
          </View>

          <View style={styles.saveRow}>
            <Button onPress={() => {}} title="Save" />
          </View>
        </View>
      </View>
    </LayoutComponent>
  );
};

export default AdminStoreInformation;

const webStyles = StyleSheet.create({
  contentWidth: {
    width: "60%",
    alignSelf: "center",
  },
  mobileWebContentWidth: {
    width: "94%",
    alignSelf: "center",
  },
});
