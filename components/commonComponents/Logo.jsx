import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { View } from 'react-native';

function Logo(props) {
    return (
        <>
           <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
      </View>
        </>
    );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00BFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default Logo;