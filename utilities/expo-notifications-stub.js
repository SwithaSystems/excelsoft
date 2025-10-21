export const getDevicePushTokenAsync = async () => {
  console.warn("Push notifications are not supported on web");
  return null;
};

export const getExpoPushTokenAsync = async () => {
  console.warn("Push notifications are not supported on web");
  return null;
};

export const setNotificationHandler = () => {
  console.warn("Push notifications are not supported on web");
};

export const addNotificationReceivedListener = () => {
  return { remove: () => {} };
};

export const addNotificationResponseReceivedListener = () => {
  return { remove: () => {} };
};

export const removeNotificationSubscription = () => {};

export const requestPermissionsAsync = async () => {
  return { status: "denied", granted: false };
};

export default {
  getDevicePushTokenAsync,
  getExpoPushTokenAsync,
  setNotificationHandler,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  requestPermissionsAsync,
};
