const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Custom resolver to completely bypass problematic modules
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Check if we're on web and trying to resolve problematic modules
  if (platform === "web") {
    if (moduleName === "react-native-country-picker-modal") {
      return {
        type: "sourceFile",
        filePath: path.resolve(
          __dirname,
          "src/utilities/country-picker-stub.js"
        ),
      };
    }

    if (moduleName === "react-async-hook") {
      return {
        type: "sourceFile",
        filePath: path.resolve(
          __dirname,
          "src/utilities/react-async-hook-stub.js"
        ),
      };
    }

    // Block any imports from the country picker modal directory
    if (moduleName.includes("react-native-country-picker-modal/")) {
      return {
        type: "sourceFile",
        filePath: path.resolve(__dirname, "src/utilities/empty-stub.js"),
      };
    }
  }

  // Use default resolution for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Rest of your config
config.resolver.resolverMainFields = ["react-native", "browser", "main"];
config.resolver.platforms = ["native", "web", "ios", "android"];

const isWeb =
  process.env.EXPO_WEB === "true" ||
  process.env.EXPO_PLATFORM === "web" ||
  process.argv.includes("--web");

if (isWeb) {
  config.resolver.alias = {
    ...config.resolver.alias,
    "@stripe/stripe-react-native": path.resolve(
      __dirname,
      "src/utilities/stripe-web-stub.js"
    ),
  };

  const blockList = [
    /node_modules\/@stripe\//,
    /react-native\/Libraries\/utilities\/codegenNativeCommands/,
    /react-native\/Libraries\/TurboModule/,
    /node_modules\/react-native-country-picker-modal\//,
  ];

  config.resolver.blockList = config.resolver.blockList
    ? [...config.resolver.blockList, ...blockList]
    : blockList;

  config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    "web.js",
    "web.ts",
    "web.tsx",
  ];
}

module.exports = config;
