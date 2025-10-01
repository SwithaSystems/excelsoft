const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Watch local utilities folder
config.watchFolders = [path.resolve(__dirname, "utilities")];

// Stub libraries mapping
const alias = {
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

// Web specific configuration
const isWeb =
  process.env.EXPO_WEB === "true" ||
  process.env.EXPO_PLATFORM === "web" ||
  process.argv.includes("--web");

if (isWeb) {
  console.log("⚡ Configuring Metro for web build - stubbing RN libraries");

  config.resolver.alias = {
    ...config.resolver.alias,
    ...alias,
  };

  // Block only problematic RN internals
  const blockList = [
    /react-native[\/\\]Libraries[\/\\]utilities[\/\\]codegenNativeCommands/,
    /react-native[\/\\]Libraries[\/\\]TurboModule/,
    /react-native[\/\\]Libraries[\/\\]BatchedBridge/,
    /react-native[\/\\]Libraries[\/\\]NativeModules/,
  ];

  config.resolver.blockList = config.resolver.blockList
    ? [...config.resolver.blockList, ...blockList]
    : blockList;

  // Prioritize web extensions
  config.resolver.sourceExts = [
    "web.js",
    "web.ts",
    "web.tsx",
    "web.jsx",
    ...config.resolver.sourceExts,
  ];
}

// Make sure resolver prioritizes web → RN → main
config.resolver.resolverMainFields = ["browser", "react-native", "main"];
config.resolver.platforms = ["native", "web", "ios", "android"];

module.exports = config;
