import Button from "@/components/commonComponents/Button";
import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import Logo from "../../components/commonComponents/Logo";
import styles from "./welcomeStyles";
import { useRouter } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { globalStyles } from "@/assets/styles/globalStyles";

const welcome = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <Logo />
        <Text style={styles.title}>Welcome to Our Store</Text>
        <Text style={styles.subtitle}>
          Sign in to access your account and start shopping. If you don’t have
          an account, sign up to join our community and enjoy our services.
        </Text>
        <Button
          title="Sign In"
          onPress={() => {
            redirectToPage(containers.signInScreen);
          }}
          style={styles.signInButton}
        />
        <Button
          title="Sign Up"
          primary={false}
          onPress={() => {}}
          style={styles.signUpButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default welcome;
