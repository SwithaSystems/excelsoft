const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Ensure proper resolution order
config.resolver.resolverMainFields = ["react-native", "browser", "main"];
config.resolver.platforms = ["native", "web", "ios", "android"];

// Web-specific overrides - more aggressive approach
const isWeb =
  process.env.EXPO_WEB === "true" ||
  process.env.EXPO_PLATFORM === "web" ||
  process.argv.includes("--web");

if (isWeb) {
  // Completely replace the module
  config.resolver.alias = {
    ...config.resolver.alias,
    "@stripe/stripe-react-native": path.resolve(
      __dirname,
      "src/utils/stripe-web-stub.js"
    ),
    "react-async-hook": require.resolve("react-async-hook/dist/index.js"),
  };

  // Block the entire stripe package directory from being processed
  const blockList = [
    // Block the entire @stripe directory on web
    /node_modules\/@stripe\//,
    // Specifically block any native command modules
    /react-native\/Libraries\/Utilities\/codegenNativeCommands/,
    // Block other potential native modules
    /react-native\/Libraries\/TurboModule/,
    /node_modules\/react-native-country-picker-modal/,
  ];

  config.resolver.blockList = config.resolver.blockList
    ? [...config.resolver.blockList, ...blockList]
    : blockList;

  // Additional resolver configuration for web
  config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    "web.js",
    "web.ts",
    "web.tsx",
  ];
}

module.exports = config;
