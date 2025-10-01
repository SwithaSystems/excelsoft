// react-async-hook-stub.js
export function useAsync() {
  console.warn("useAsync is not supported on web. Returning empty state.");
  return { loading: false, error: null, result: null };
}

export function useAsyncCallback(fn) {
  console.warn("useAsyncCallback is not supported on web. Returning no-op.");
  return { execute: async () => null, loading: false, error: null, result: null };
}
