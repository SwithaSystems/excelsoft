// metro.config.js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

// Load Expo’s default Metro config
const config = getDefaultConfig(__dirname);

// ---------------------------
// Watch the utilities folder for stub files
// ---------------------------
config.watchFolders = [path.resolve(__dirname, "utilities")];

// ---------------------------
// Define all web stubs here
// ---------------------------
const alias = {
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
  "generator-function": path.resolve(__dirname, "utilities/generator-function-stub.js"),
};

// Merge with any existing aliases
config.resolver.alias = { ...(config.resolver.alias || {}), ...alias };

// Save original resolver
const originalResolveRequest = config.resolver.resolveRequest;

// ---------------------------
// Custom resolver for stubs and special cases
// ---------------------------
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // ✅ Check alias first
  if (alias[moduleName]) {
    return { filePath: alias[moduleName], type: "sourceFile" };
  }

  // ✅ Special Animated cases
  if (moduleName.includes("NativeAnimatedHelper")) {
    return { filePath: alias["react-native-web/dist/cjs/vendor/react-native/Animated/NativeAnimatedHelper"], type: "sourceFile" };
  }
  if (moduleName.includes("NativeAnimatedModule")) {
    return { filePath: alias["react-native-web/dist/cjs/vendor/react-native/Animated/NativeAnimatedModule"], type: "sourceFile" };
  }

  // ✅ Fallback to original resolver
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// ---------------------------
// Web-specific extensions
// ---------------------------
config.resolver.sourceExts = [
  "web.js",
  "web.ts",
  "web.tsx",
  "web.jsx",
  ...config.resolver.sourceExts,
];

config.resolver.resolverMainFields = ["browser", "react-native", "main"];
config.resolver.platforms = ["web", "ios", "android", "native"];

// ---------------------------
// Export final Metro config
// ---------------------------
module.exports = config;
