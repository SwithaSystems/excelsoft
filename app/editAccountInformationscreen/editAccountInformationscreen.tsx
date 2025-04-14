import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./editAccountInformationscreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { FontAwesome } from "@expo/vector-icons";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { Image } from "react-native-elements";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const editAccountInformationscreen = () => {
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [email, setEmail] = useState("Denniskatleenam@gmail.com");
  return (
    <View style={globalStyles.container}>
      <Header headerText="Edit Account Information" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <View style={globalStyles.profilePictureContainer}>
            <Image
              source={{ uri: "https://picsum.photos/100" }}
              style={globalStyles.profileImage}
            />
          </View>
          <View style={globalStyles.profileInputContainer}>
            <FontAwesome
              name="phone"
              size={32}
              style={globalStyles.userInputLabelIcon}
            />
            <View style={{ flex: 1, paddingLeft: 14 }}>
            <View style ={globalStyles.deviceHeading}>
              <Text style={globalStyles.userInputLabel}>Phone</Text>
              <TouchableOpacity
                  /* onPress={(

                   )}*/  
                >       
                <Text style={globalStyles.verify}>verify</Text>
              </TouchableOpacity>
            </View>
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
            <View style ={globalStyles.deviceHeading}>
              <Text style={globalStyles.userInputLabel}>Email</Text>
              <TouchableOpacity
                  /* onPress={(

                   )}*/  
                >       
                <Text style={globalStyles.verify}>verify</Text>
              </TouchableOpacity>
            </View>
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
      <View style={globalStyles.p_3}>
        <Button
          onPress={() => {
            redirectToPage(containers.userProfileScreenScreen);
          }}
          title="Save"
        />
      </View>
    </View>
  );
};

export default editAccountInformationscreen;
