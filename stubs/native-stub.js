const React = require('react');

function StubComponent(props) {
  if (props && props.children) {
    return props.children;
  }
  return null;
}

StubComponent.displayName = 'NativeStub';

// Stub function that returns a rejected promise
function stubAsyncFunction() {
  return Promise.reject(new Error('This native feature is not available on web'));
}

// Stub function that returns null
function stubFunction() {
  return null;
}

// Stub hook that returns an empty object
function stubHook() {
  return {};
}

// Create a Proxy to handle any property access
const createProxy = () => {
  return new Proxy({}, {
    get: function(target, prop) {
      // Handle common module exports
      if (prop === 'default') {
        return StubComponent;
      }
      
      if (prop === '__esModule') {
        return true;
      }
      
      // Handle named exports
      if (typeof prop === 'string') {
        // React hooks (useState, useEffect, etc.)
        if (prop.startsWith('use')) {
          return stubHook;
        }
        
        // React components (start with capital letter)
        if (prop.match(/^[A-Z]/)) {
          return StubComponent;
        }
        
        // Common provider/consumer patterns
        if (prop === 'Provider' || prop === 'Consumer' || prop === 'Context') {
          return StubComponent;
        }
        
        // Functions
        return stubAsyncFunction;
      }
      
      return undefined;
    },
    
    // Handle function calls on the module itself
    apply: function() {
      return stubFunction();
    }
  });
};

// Export the proxy as the module
module.exports = createProxy();

// Also add common named exports explicitly for better compatibility
module.exports.Provider = StubComponent;
module.exports.Consumer = StubComponent;
module.exports.Container = StubComponent;
module.exports.default = StubComponent;
module.exports.__esModule = true;