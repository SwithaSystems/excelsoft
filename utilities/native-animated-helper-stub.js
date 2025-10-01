// Stub for NativeAnimatedHelper
const API = {
  getValue: () => {},
  setWaitingForIdentifier: () => {},
  unsetWaitingForIdentifier: () => {},
  disableQueue: () => {},
  queueOperation: () => {},
  createAnimatedNode: () => {},
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
  flushQueue: () => {}, // ADD THIS
};

module.exports = {
  shouldUseNativeDriver: () => false,
  API: API,
  addWhitelistedStyleProp: () => {},
  addWhitelistedTransformProp: () => {},
  addWhitelistedInterpolationParam: () => {},
  validateStyles: () => {},
  validateTransform: () => {},
  validateInterpolation: () => {},
  generateNewNodeTag: () => 1,
  generateNewAnimationId: () => 1,
  assertNativeAnimatedModule: () => {},
};

module.exports.default = module.exports;