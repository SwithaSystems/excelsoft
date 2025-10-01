const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, "utilities")];

// Add all the aliases
config.resolver.alias = {
  "expo-secure-store": path.resolve(__dirname, "utilities/expo-secure-store-stub.js"),
  "react-async-hook": path.resolve(__dirname, "utilities/react-async-hook-stub.js"),
  "react-native-country-picker-modal": path.resolve(__dirname, "utilities/country-picker-stub.js"),
  "@stripe/stripe-react-native": path.resolve(__dirname, "utilities/stripe-web-stub.js"),
  "react-native-vector-icons": path.resolve(__dirname, "utilities/empty-stub.js"),
  "react-native-linear-gradient": path.resolve(__dirname, "utilities/empty-stub.js"),
  "expo-modules-core/src/NativeModule": path.resolve(__dirname, "utilities/expo-modules-core-stub.js"),
  "expo-modules-core/src/ensureNativeModulesAreInstalled": path.resolve(__dirname, "utilities/ensure-native-modules-stub.js"),
  "react-native/Libraries/TurboModule/TurboModuleRegistry": path.resolve(__dirname, "utilities/turbo-module-stub.js"),
  "react-native-web/dist/cjs/vendor/react-native/Animated/NativeAnimatedModule": path.resolve(__dirname, "utilities/native-animated-module-stub.js"),
  "react-native-web/dist/cjs/vendor/react-native/Animated/NativeAnimatedHelper": path.resolve(__dirname, "utilities/native-animated-helper-stub.js"),
  "react-native-web/dist/vendor/react-native/Animated/NativeAnimatedModule": path.resolve(__dirname, "utilities/native-animated-module-stub.js"),
  "react-native-web/dist/vendor/react-native/Animated/NativeAnimatedHelper": path.resolve(__dirname, "utilities/native-animated-helper-stub.js"),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const emptyStubPath = path.resolve(__dirname, "utilities/empty-stub.js");
  
  // Intercept NativeAnimatedHelper imports (both absolute and relative)
  if (moduleName.includes('NativeAnimatedHelper')) {
    return {
      filePath: path.resolve(__dirname, "utilities/native-animated-helper-stub.js"),
      type: 'sourceFile',
    };
  }
  
  // Intercept NativeAnimatedModule imports
  if (moduleName.includes('NativeAnimatedModule')) {
    return {
      filePath: path.resolve(__dirname, "utilities/native-animated-module-stub.js"),
      type: 'sourceFile',
    };
  }
  
  if (moduleName === 'react-native/Libraries/TurboModule/TurboModuleRegistry' ||
      moduleName.includes('/TurboModule/TurboModuleRegistry') ||
      moduleName.endsWith('TurboModuleRegistry')) {
    return {
      filePath: path.resolve(__dirname, "utilities/turbo-module-stub.js"),
      type: 'sourceFile',
    };
  }
  
  if (platform === 'web') {
    if (moduleName.includes('expo-modules-core')) {
      if (moduleName.includes('ensureNativeModulesAreInstalled')) {
        return {
          filePath: path.resolve(__dirname, "utilities/ensure-native-modules-stub.js"),
          type: 'sourceFile',
        };
      }
      if (moduleName.includes('NativeModule')) {
        return {
          filePath: path.resolve(__dirname, "utilities/expo-modules-core-stub.js"),
          type: 'sourceFile',
        };
      }
    }

    if (moduleName.startsWith('@stripe/stripe-react-native')) {
      return {
        filePath: path.resolve(__dirname, "utilities/stripe-web-stub.js"),
        type: 'sourceFile',
      };
    }
    
    if (moduleName.startsWith('react-native/Libraries/')) {
      return {
        filePath: emptyStubPath,
        type: 'sourceFile',
      };
    }
  }
  
  if (
    moduleName.includes('codegenNativeCommands') ||
    moduleName.includes('codegenNativeComponent')
  ) {
    return {
      filePath: emptyStubPath,
      type: 'sourceFile',
    };
  }
  
  if (moduleName.includes('react-async-hook')) {
    return {
      filePath: path.resolve(__dirname, "utilities/react-async-hook-stub.js"),
      type: 'sourceFile',
    };
  }
  
  if (moduleName.includes('react-native-country-picker-modal')) {
    return {
      filePath: path.resolve(__dirname, "utilities/country-picker-stub.js"),
      type: 'sourceFile',
    };
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

const blockList = [
  /@stripe[\/\\]stripe-react-native[\/\\]lib[\/\\]commonjs[\/\\]specs/,
  /@stripe[\/\\]stripe-react-native[\/\\]lib[\/\\]module[\/\\]specs/,
  /react-native[\/\\]Libraries[\/\\]Utilities[\/\\]codegenNativeCommands/,
  /react-native[\/\\]Libraries[\/\\]Utilities[\/\\]codegenNativeComponent/,
  /.*[\/\\]__tests__[\/\\].*\.ignore\.tsx?$/,
  /.*\.test\.tsx?$/,
  /.*\.spec\.tsx?$/,
];

config.resolver.blockList = Array.isArray(config.resolver.blockList)
  ? [...config.resolver.blockList, ...blockList]
  : blockList;

config.resolver.sourceExts = ["web.js", "web.ts", "web.tsx", "web.jsx", ...config.resolver.sourceExts];
config.resolver.resolverMainFields = ["browser", "react-native", "main"];
config.resolver.platforms = ["web", "ios", "android", "native"];

module.exports = config;