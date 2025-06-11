import { Dimensions, StyleSheet } from 'react-native';
import colors from '../config/colors';

const { width } = Dimensions.get('window');
  const actionBtnWidth = ((width - 30) / 2) - 8;
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
    // marginTop: 8,
  },
  editText: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16
  },
  actionText: {
    fontSize: 14,
    marginLeft: 20,
  },
  settingsTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  settingsContainer: {
    // paddingHorizontal: 30,
    flex:0,
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    marginBottom: 16,
    borderRadius: 10,
  },
  settingText: {
    fontSize: 14,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    marginTop: 24,
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    marginTop: 4
  },
});

export default styles;
