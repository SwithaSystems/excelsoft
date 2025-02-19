import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import Header from "@/components/Header";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-elements";
import styles from "./editProfileScreenStyles";
import colors from "../config/colors";

const editProfileScreen = () => {
  const [firstName, setFirstName] = useState("Katleena M.");
  const [lastName, setLastName] = useState("Dennis");
  const [dateOfBirth, setDateOfBirth] = useState("01/02/1999");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [email, setEmail] = useState("Denniskatleenam@gmail.com");
  return (
    <View style={globalStyles.container}>
      <Header headerText="Edit Profile" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {/* Profile Picture */}
          <View style={globalStyles.profilePictureContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={globalStyles.profileImage}
            />
            <TouchableOpacity style={styles.changePictureButton}>
              <Feather name="camera" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.changePictureText}>Change Profile Picture</Text>
          </View>
          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="user-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>First Name</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="First Name"
                value={firstName}
                onPress={() => {}}
                setValue={setFirstName}
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="user-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Last Name</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Last Name"
                value={lastName}
                onPress={() => {}}
                setValue={setLastName}
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="calendar-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Date of Birth</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="--/--/----"
                value={dateOfBirth}
                onPress={() => {}}
                setValue={setDateOfBirth}
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="phone"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Phone</Text>
              <CustomTextInput
                disabled={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="phone number"
                value={phone}
                onPress={() => {}}
                setValue={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="envelope-o"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={globalStyles.userInputLabel}>Email</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="email"
                disabled={true}
                value={email}
                onPress={() => {}}
                setValue={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[globalStyles.p_3]}>
        <Button
          title="Save"
          onPress={() => {
            redirectToPage(containers.userProfileScreenScreen);
          }}
        />
      </View>
    </View>
  );
};

export default editProfileScreen;
