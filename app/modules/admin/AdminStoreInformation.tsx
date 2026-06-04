import React, { useEffect, useMemo, useState } from "react";
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
import { storeSettingsAPI } from "@/services/storeSettingsService";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";

function from24To12(time: string): { h: string; m: string; p: "am" | "pm" } {
  const [hh = "07", mm = "00"] = (time || "07:00").split(":");
  const hNum = Number(hh);
  const period = hNum >= 12 ? "pm" : "am";
  const display = hNum % 12 === 0 ? 12 : hNum % 12;
  return { h: String(display), m: mm, p: period };
}

function from12To24(hours: string, minutes: string, period: string): string {
  let h = Number(hours || 0);
  const m = Math.min(59, Math.max(0, Number(minutes || 0)));
  if (period === "pm" && h < 12) h += 12;
  if (period === "am" && h === 12) h = 0;
  return `${String(Math.min(23, Math.max(0, h))).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const AdminStoreInformation = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const [storeName, setStoreName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [closingHours, setClosingHours] = useState("");
  const [closingMinutes, setClosingMinutes] = useState("");
  const [closingPeriod, setClosingPeriod] = useState("pm");
  const [storeTimeZone, setStoreTimeZone] = useState("Europe/London");
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const isValidPhone = useMemo(() => {
    if (!contactDetails) return true;
    return /^\+?[0-9\s-]{7,20}$/.test(contactDetails);
  }, [contactDetails]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await storeSettingsAPI.getSettings();
        const data = res.data || {};

        setStoreName(data.storeName || "");
        setContactDetails(data.contactDetails || "");
        setStoreAddress(data.storeAddress || "");
        setStoreTimeZone(data.storeTimeZone || "Europe/London");
        setIsStoreOpen(data.isStoreOpen !== false);

        const o = from24To12(data.storeOpeningTime || "07:00");
        setHours(o.h);
        setMinutes(o.m);
        setPeriod(o.p);

        const c = from24To12(data.storeClosingTime || "17:00");
        setClosingHours(c.h);
        setClosingMinutes(c.m);
        setClosingPeriod(c.p);
      } catch (error) {
        console.error("Failed to fetch store settings", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const onSave = async () => {
    if (!isValidPhone) {
      showAlert("Invalid Contact", "Please enter a valid phone number.");
      return;
    }

    try {
      setSaving(true);
      await storeSettingsAPI.updateSettings({
        storeName,
        contactDetails,
        storeAddress,
        isStoreOpen,
        storeTimeZone,
        storeOpeningTime: from12To24(hours, minutes, period),
        storeClosingTime: from12To24(closingHours, closingMinutes, closingPeriod),
      });
      showAlert("Success", "Saved successfully");
    } catch (error: any) {
      console.error("Failed to update store settings", error);
      showAlert("Error", error?.response?.data?.message || "Failed to update store settings.");
    } finally {
      setSaving(false);
    }
  };

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
              {!isValidPhone && (
                <Text style={{ color: "#C62828", marginTop: 6 }}>Enter a valid phone number.</Text>
              )}
            </View>
          </View>

          <View style={[utilitiesStyles.flex_1, styles.timeSection]}>
            <Text style={globalStyles.userInputLabel}>Opening hours</Text>
            <View style={[globalStyles.timeContainer, styles.timeContainer]}>
              <TextInput style={globalStyles.timeInput} placeholder="HH" keyboardType="numeric" maxLength={2} value={hours} onChangeText={setHours} />
              <Text>:</Text>
              <TextInput style={globalStyles.timeInput} placeholder="MM" keyboardType="numeric" maxLength={2} value={minutes} onChangeText={setMinutes} />
              <View style={styles.pickerWrap}>
                {!isWeb && <Text style={styles.pickerDisplayText}>{period.toUpperCase()}</Text>}
                <Ionicons name="chevron-down" size={18} color={colors.black} style={styles.pickerChevron} pointerEvents="none" />
                <Picker selectedValue={period} style={[globalStyles.picker_sm, styles.pickerSm, !isWeb && styles.pickerSmMobile, !isWeb && { width: 110 }]} itemStyle={styles.pickerItem} mode="dropdown" dropdownIconColor={colors.black} onValueChange={(itemValue) => setPeriod(itemValue)}>
                  <Picker.Item style={[globalStyles.pickerValue_sm, styles.pickerItem]} label="AM" value="am" />
                  <Picker.Item style={[globalStyles.pickerValue_sm, styles.pickerItem]} label="PM" value="pm" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={[utilitiesStyles.flex_1, styles.timeSection]}>
            <Text style={globalStyles.userInputLabel}>Closing hours</Text>
            <View style={[globalStyles.timeContainer, styles.timeContainer]}>
              <TextInput style={globalStyles.timeInput} placeholder="HH" keyboardType="numeric" maxLength={2} value={closingHours} onChangeText={setClosingHours} />
              <Text>:</Text>
              <TextInput style={globalStyles.timeInput} placeholder="MM" keyboardType="numeric" maxLength={2} value={closingMinutes} onChangeText={setClosingMinutes} />
              <View style={styles.pickerWrap}>
                {!isWeb && <Text style={styles.pickerDisplayText}>{closingPeriod.toUpperCase()}</Text>}
                <Ionicons name="chevron-down" size={18} color={colors.black} style={styles.pickerChevron} pointerEvents="none" />
                <Picker selectedValue={closingPeriod} style={[globalStyles.picker_sm, styles.pickerSm, !isWeb && styles.pickerSmMobile, !isWeb && { width: 110 }]} itemStyle={styles.pickerItem} mode="dropdown" dropdownIconColor={colors.black} onValueChange={(itemValue) => setClosingPeriod(itemValue)}>
                  <Picker.Item style={[globalStyles.pickerValue_sm, styles.pickerItem]} label="AM" value="am" />
                  <Picker.Item style={[globalStyles.pickerValue_sm, styles.pickerItem]} label="PM" value="pm" />
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
            <Button onPress={onSave} title={loading ? "Loading..." : saving ? "Saving..." : "Save"} disabled={loading || saving} />
          </View>
        </View>
      </View>
      {confirmationModal}
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
