import { router } from "expo-router";

export const redirectToPage = (pageName, params = {}) => {
  router.push({
    pathname: `/${pageName}`,
    params: { ...params },
  });
};

export const clearNavigationStack = (pageName, params = {}) => {
  router.replace({
    pathname: `/${pageName}`,
    params: { ...params },
  });
};