export const useAsync = () => ({
  loading: false,
  error: null,
  result: null,
});

export const useAsyncCallback = () => [
  () => Promise.resolve(),
  {
    loading: false,
    error: null,
    result: null,
  },
];

export default { useAsync, useAsyncCallback };
