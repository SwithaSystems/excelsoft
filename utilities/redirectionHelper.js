import { router } from "expo-router";

export const redirectToPage = (pageName, params = {}) => {
  router.navigate({
    pathname: pageName,
    params: { ...params },
  });
};
