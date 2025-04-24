import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
 greeting: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 16
  },
  userName: {
    fontSize: 16,
    textAlign: "center",
  },
  editProfile: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 8,
  },
  editText: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
  },
  settingsTitle: {
    fontSize: 18,
    marginBottom: 16,
    marginLeft: 16,
  },
  settingsContainer: {
    paddingHorizontal: 30
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.black,
    marginBottom: 16,
    borderRadius: 10,
  },
  settingText: {
    fontSize: 14,
  },
});

export default styles;
