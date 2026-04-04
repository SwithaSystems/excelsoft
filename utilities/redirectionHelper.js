import { router } from "expo-router";

export const redirectToPage = (pageName, params = {}) => {
  const pathname = `/${pageName}`;
  if (typeof console !== "undefined") {
    console.log("[redirectToPage] pathname:", pathname, "params:", params);
  }
  try {
    if (Object.keys(params).length === 0) {
      router.push(pathname);
    } else {
      router.push({ pathname: pathname, params: { ...params } });
    }
  } catch (e) {
    console.error("[redirectToPage] Error:", e);
  }
};

export const clearNavigationStack = (pageName, params = {}) => {
  router.replace({
    pathname: `/${pageName}`,
    params: { ...params },
  });
};