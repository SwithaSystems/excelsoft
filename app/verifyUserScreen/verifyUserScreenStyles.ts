// verifyUserScreenStyles.ts

import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  headingText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
    textAlign:'center'
  },
  scanner: {
    alignItems: 'center',
    marginVertical: 16,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    marginBottom: 20,
  },
  qrInputWrapper: {
    marginTop: 10,
    marginBottom: 30,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
});

export default styles;
