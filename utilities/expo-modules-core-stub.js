// utilities/expo-modules-core-stub.js
export function ensureNativeModulesAreInstalled() {
  // No-op for web - always return true
}

export const NativeModulesProxy = new Proxy({}, {
  get() {
    return {};
  }
});

export function requireNativeModule() {
  return {};
}

// Export both named and default
module.exports = {
  ensureNativeModulesAreInstalled,
  NativeModulesProxy,
  requireNativeModule,
};

module.exports.ensureNativeModulesAreInstalled = ensureNativeModulesAreInstalled;
module.exports.NativeModulesProxy = NativeModulesProxy;
module.exports.requireNativeModule = requireNativeModule;