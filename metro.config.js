const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// List of native-only packages to stub on web
const nativeModules = [
  '@stripe/stripe-react-native',
  'react-native-purchases',
  'react-native-camera',
  'react-native-image-picker',
  'react-native-permissions',
  '@react-native-community/geolocation',
  'react-native-push-notification',
  'react-native-biometrics',
  '@react-native-firebase/app',
  '@react-native-firebase/messaging',
  'react-native-gesture-handler',
  'react-native-country-picker-modal',
  'react-async-hook',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    
    if (moduleName === 'expo-secure-store') {
      return {
        filePath: path.resolve(__dirname, 'stubs/expo-secure-store.js'),
        type: 'sourceFile',
      };
    }

    if (nativeModules.includes(moduleName)) {
      return {
        filePath: path.resolve(__dirname, 'stubs/native-stub.js'),
        type: 'sourceFile',
      };
    }
    
    if (moduleName.startsWith('react-native/Libraries/')) {
      return {
        filePath: path.resolve(__dirname, 'stubs/native-stub.js'),
        type: 'sourceFile',
      };
    }
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;