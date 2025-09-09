import colors from "@/constants/colors";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { CustomTextInput } from "./commonComponents/CustomTextInput";
import { globalStyles } from "@/assets/styles/globalStyles";

function OrderCollectionDetails(props) {
  const [selectedOption, setSelectedOption] = useState("myself");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const options = [
    { value: "myself", displayTitle: "Myself" },
    { value: "someoneElse", displayTitle: "Someone Else" },
  ];
  return (
    <>
      <View>
        <Text style={styles.label}>Let us know who is collecting?</Text>
        <View>
          {options.map((option, index) => {
            return (
              <>
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selectedOption == option.value && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedOption(option.value)}
                >
                  <View style={styles.radioCircle}>
                    {selectedOption == option.value && (
                      <View style={styles.selectedRadio} />
                    )}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.optionLabel}>
                      {option.displayTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            );
          })}
        </View>

        {selectedOption === "someoneElse" && (
          <>
            <Text style={{ fontSize: 14, marginVertical: 12 }}>
              Fill some basic details of the person who is going to reciver the
              order.
            </Text>
            <View style={[globalStyles.px_3]}>
              <Text style={styles.label}>First Name</Text>
              <CustomTextInput
                containerStyle={globalStyles.mb_3}
                setValue={setFirstName}
                placeholder="First Name"
                //keyboardType="phone-pad"
                value={firstName}
              />
              <Text style={styles.label}>Last Name</Text>
              <CustomTextInput
                //style={styles.input}
                placeholder="Last Name"
                //keyboardType="phone-pad"
                value={lastName}
                containerStyle={globalStyles.mb_3}
                setValue={setLastName}
              />
              <Text style={styles.label}>Phone *</Text>
              <CustomTextInput
                // style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                setValue={setPhone}
                containerStyle={globalStyles.mb_3}
              />
              <Text style={styles.label}>Email</Text>
              <CustomTextInput
                //style={styles.input}
                placeholder="Email"
                //containerStyle={globalStyles.mb_3}
                //keyboardType="phone-pad"
                value={email}
                setValue={setEmail}
              />
            </View>
          </>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 14,
  },
  selectedRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { marginBottom: 4 },
  textContainer: { marginLeft: 14 },
});
export default OrderCollectionDetails;
