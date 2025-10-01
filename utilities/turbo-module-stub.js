// More complete TurboModuleRegistry mock
const TurboModuleRegistry = {
  get(name) {
    if (name === 'NativeAnimatedModule') {
      return {
        startOperationBatch: () => {},
        finishOperationBatch: () => {},
        createAnimatedNode: () => {},
        getValue: () => {},
        startListeningToAnimatedNodeValue: () => {},
        stopListeningToAnimatedNodeValue: () => {},
        connectAnimatedNodes: () => {},
        disconnectAnimatedNodes: () => {},
        startAnimatingNode: () => {},
        stopAnimation: () => {},
        setAnimatedNodeValue: () => {},
        setAnimatedNodeOffset: () => {},
        flattenAnimatedNodeOffset: () => {},
        extractAnimatedNodeOffset: () => {},
        connectAnimatedNodeToView: () => {},
        disconnectAnimatedNodeFromView: () => {},
        restoreDefaultValues: () => {},
        dropAnimatedNode: () => {},
        addAnimatedEventToView: () => {},
        removeAnimatedEventFromView: () => {},
        addListener: () => {},
        removeListeners: () => {},
      };
    }
    return null;
  },
  getEnforcing(name) {
    const module = this.get(name);
    if (!module) {
      throw new Error(`TurboModuleRegistry.getEnforcing('${name}') is not supported on web`);
    }
    return module;
  },
};

module.exports = TurboModuleRegistry;
module.exports.TurboModuleRegistry = TurboModuleRegistry;
module.exports.default = TurboModuleRegistry;