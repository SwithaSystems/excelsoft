import { router } from "expo-router";

export const redirectToPage = (pageName, params = {}) => {
  router.push({
    pathname: `/${pageName}`,
    params: { ...params },
  });
};
