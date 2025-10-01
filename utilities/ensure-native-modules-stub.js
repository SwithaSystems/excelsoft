// utilities/ensure-native-modules-stub.js
export function ensureNativeModulesAreInstalled() {
  // No-op for web
}

module.exports = { ensureNativeModulesAreInstalled };
module.exports.ensureNativeModulesAreInstalled = ensureNativeModulesAreInstalled;