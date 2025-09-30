const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// List of React Native libraries to block/stub for web
const REACT_NATIVE_LIBRARIES = [
  // Core React Native modules
  "react-native",
  "@react-native/",
  "@react-native-community/",
  "@react-native-async-storage/",

  // Common React Native libraries
  "react-native-country-picker-modal",
  "react-async-hook",
  "@stripe/stripe-react-native",
  "react-native-vector-icons",
  "react-native-maps",
  "react-native-camera",
  "react-native-image-picker",
  "react-native-permissions",
  "react-native-geolocation",
  "react-native-device-info",
  "react-native-keychain",
  "react-native-biometrics",
  "react-native-share",
  "react-native-file-picker",
  "react-native-document-picker",
  "react-native-pdf",
  "react-native-webview",
  "react-native-linear-gradient",
  "react-native-svg",
  "react-native-reanimated",
  "react-native-gesture-handler",
  "react-native-safe-area-context",
  "react-native-screens",
  "@react-navigation/native",
  "react-native-orientation",
  "react-native-splash-screen",
  "react-native-status-bar",
  "react-native-haptic-feedback",
  "react-native-sound",
  "react-native-video",
  "react-native-bluetooth",
  "react-native-nfc",
  "react-native-contacts",
  "react-native-calendar",
  "react-native-push-notification",
];

// Function to check if a module is a React Native library
function isReactNativeLibrary(moduleName) {
  return REACT_NATIVE_LIBRARIES.some(
    (lib) =>
      moduleName === lib ||
      moduleName.startsWith(lib + "/") ||
      moduleName.startsWith(lib + "\\")
  );
}

// Create stub file paths
const getStubPath = (moduleName) => {
  if (
    moduleName.includes("country-picker") ||
    moduleName === "react-native-country-picker-modal"
  ) {
    return path.resolve(__dirname, "src/utilities/country-picker-stub.js");
  } else if (moduleName.includes("stripe")) {
    return path.resolve(__dirname, "src/utilities/stripe-web-stub.js");
  } else if (
    moduleName === "react-async-hook" ||
    moduleName.includes("async-hook")
  ) {
    return path.resolve(__dirname, "src/utilities/react-async-hook-stub.js");
  } else {
    // Generic empty stub for other React Native libraries
    return path.resolve(__dirname, "src/utilities/empty-stub.js");
  }
};

// Custom resolver to handle React Native libraries for web
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Only apply blocking for web platform
  if (platform === "web") {
    // Check if this is a React Native library that should be stubbed
    if (isReactNativeLibrary(moduleName)) {
      console.warn(`Blocking React Native library for web: ${moduleName}`);

      const stubPath = getStubPath(moduleName);

      return {
        type: "sourceFile",
        filePath: stubPath,
      };
    }

    // Special handling for nested dependencies
    // This catches cases where react-async-hook is imported from within other packages
    if (
      moduleName === "react-async-hook" ||
      context.originModulePath?.includes("react-native-country-picker-modal")
    ) {
      console.warn(`Stubbing nested dependency for web: ${moduleName}`);

      return {
        type: "sourceFile",
        filePath: getStubPath(moduleName),
      };
    }
  }

  // Use default resolution for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Enhanced configuration for web platform
const isWeb =
  process.env.EXPO_WEB === "true" ||
  process.env.EXPO_PLATFORM === "web" ||
  process.argv.includes("--web");

if (isWeb) {
  console.log(
    "Configuring Metro for web build - blocking React Native libraries"
  );

  // Set up aliases for specific libraries that have web alternatives
  config.resolver.alias = {
    ...config.resolver.alias,
    // Make sure these aliases take precedence
    "expo-secure-store": path.resolve(
      __dirname,
      "src/utilities/expo-secure-store-stub.js"
    ),
    "react-async-hook": path.resolve(
      __dirname,
      "src/utilities/react-async-hook-stub.js"
    ),
    "react-native-country-picker-modal": path.resolve(
      __dirname,
      "src/utilities/country-picker-stub.js"
    ),
    "@stripe/stripe-react-native": path.resolve(
      __dirname,
      "src/utilities/stripe-web-stub.js"
    ),
    "react-native-vector-icons": path.resolve(
      __dirname,
      "src/utilities/empty-stub.js"
    ),
    "react-native-linear-gradient": path.resolve(
      __dirname,
      "src/utilities/empty-stub.js"
    ),
  };

  // Extended block list for React Native specific modules
  const blockList = [
    // Block the entire react-native-country-picker-modal directory
    /node_modules[\/\\]react-native-country-picker-modal[\/\\]/,

    // Block react-async-hook wherever it appears
    /node_modules[\/\\].*[\/\\]react-async-hook[\/\\]/,
    /node_modules[\/\\]react-async-hook[\/\\]/,

    // Stripe native modules
    /node_modules[\/\\]@stripe[\/\\]/,

    // React Native core modules that shouldn't be used on web
    /react-native[\/\\]Libraries[\/\\]utilities[\/\\]codegenNativeCommands/,
    /react-native[\/\\]Libraries[\/\\]TurboModule/,
    /react-native[\/\\]Libraries[\/\\]BatchedBridge/,
    /react-native[\/\\]Libraries[\/\\]NativeModules/,

    // React Native community modules
    /node_modules[\/\\]@react-native-community[\/\\]/,
    /node_modules[\/\\]@react-native-async-storage[\/\\]/,

    // Other common React Native libraries
    /node_modules[\/\\]react-native-vector-icons[\/\\]/,
    /node_modules[\/\\]react-native-maps[\/\\]/,
    /node_modules[\/\\]react-native-camera[\/\\]/,
    /node_modules[\/\\]react-native-permissions[\/\\]/,
    /node_modules[\/\\]react-native-device-info[\/\\]/,
    /node_modules[\/\\]react-native-keychain[\/\\]/,
    /node_modules[\/\\]react-native-biometrics[\/\\]/,
    /node_modules[\/\\]react-native-geolocation[\/\\]/,
    /node_modules[\/\\]react-native-orientation[\/\\]/,
    /node_modules[\/\\]react-native-splash-screen[\/\\]/,
    /node_modules[\/\\]react-native-haptic-feedback[\/\\]/,
    /node_modules[\/\\]react-native-bluetooth[\/\\]/,
    /node_modules[\/\\]react-native-nfc[\/\\]/,
    /node_modules[\/\\]react-native-contacts[\/\\]/,
    /node_modules[\/\\]react-native-push-notification[\/\\]/,
  ];

  config.resolver.blockList = config.resolver.blockList
    ? [...config.resolver.blockList, ...blockList]
    : blockList;

  // Prioritize web-specific file extensions
  config.resolver.sourceExts = [
    "web.js",
    "web.ts",
    "web.tsx",
    "web.jsx",
    ...config.resolver.sourceExts,
  ];
}

// Set resolver main fields to prioritize web-compatible versions
config.resolver.resolverMainFields = ["browser", "react-native", "main"];
config.resolver.platforms = ["native", "web", "ios", "android"];

module.exports = config;
