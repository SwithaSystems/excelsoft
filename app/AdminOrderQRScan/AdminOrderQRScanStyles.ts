import { StyleSheet } from 'react-native';
import colors from '../config/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  instructionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  qrIcon: {
    alignSelf: 'center',
    marginVertical: 40,
  },
  orText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 12,
  },
  inputSection: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
