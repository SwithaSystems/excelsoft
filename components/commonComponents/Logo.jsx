import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { View } from 'react-native';
import colors from './config/colors';

function Logo(props) {
    return (
        <>
           <View style={[ props?.logoContainer]}>
        <View style={[styles.logo, props?.logoStyle]}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
      </View>
        </>
    );
}

const styles = StyleSheet.create({
  logoContainer: {
   // marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.deepSkyBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default Logo;