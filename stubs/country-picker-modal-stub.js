import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', callingCode: '93', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', callingCode: '355', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', callingCode: '213', flag: '🇩🇿' },
  { code: 'AR', name: 'Argentina', callingCode: '54', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', callingCode: '61', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', callingCode: '43', flag: '🇦🇹' },
  { code: 'BD', name: 'Bangladesh', callingCode: '880', flag: '🇧🇩' },
  { code: 'BE', name: 'Belgium', callingCode: '32', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil', callingCode: '55', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', callingCode: '1', flag: '🇨🇦' },
  { code: 'CN', name: 'China', callingCode: '86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', callingCode: '57', flag: '🇨🇴' },
  { code: 'CZ', name: 'Czech Republic', callingCode: '420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', callingCode: '45', flag: '🇩🇰' },
  { code: 'EG', name: 'Egypt', callingCode: '20', flag: '🇪🇬' },
  { code: 'FI', name: 'Finland', callingCode: '358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', callingCode: '33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', callingCode: '49', flag: '🇩🇪' },
  { code: 'GR', name: 'Greece', callingCode: '30', flag: '🇬🇷' },
  { code: 'HK', name: 'Hong Kong', callingCode: '852', flag: '🇭🇰' },
  { code: 'IN', name: 'India', callingCode: '91', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', callingCode: '62', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', callingCode: '353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', callingCode: '972', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', callingCode: '39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', callingCode: '81', flag: '🇯🇵' },
  { code: 'KE', name: 'Kenya', callingCode: '254', flag: '🇰🇪' },
  { code: 'MY', name: 'Malaysia', callingCode: '60', flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico', callingCode: '52', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', callingCode: '31', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', callingCode: '64', flag: '🇳🇿' },
  { code: 'NG', name: 'Nigeria', callingCode: '234', flag: '🇳🇬' },
  { code: 'NO', name: 'Norway', callingCode: '47', flag: '🇳🇴' },
  { code: 'PK', name: 'Pakistan', callingCode: '92', flag: '🇵🇰' },
  { code: 'PH', name: 'Philippines', callingCode: '63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', callingCode: '48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', callingCode: '351', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', callingCode: '40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', callingCode: '7', flag: '🇷🇺' },
  { code: 'SA', name: 'Saudi Arabia', callingCode: '966', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', callingCode: '65', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', callingCode: '27', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', callingCode: '82', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', callingCode: '34', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', callingCode: '94', flag: '🇱🇰' },
  { code: 'SE', name: 'Sweden', callingCode: '46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', callingCode: '41', flag: '🇨🇭' },
  { code: 'TW', name: 'Taiwan', callingCode: '886', flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand', callingCode: '66', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey', callingCode: '90', flag: '🇹🇷' },
  { code: 'UA', name: 'Ukraine', callingCode: '380', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', callingCode: '971', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', callingCode: '44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', callingCode: '1', flag: '🇺🇸' },
  { code: 'VN', name: 'Vietnam', callingCode: '84', flag: '🇻🇳' },
];

const CountryPicker = ({
  countryCode,
  onSelect,
  withFlag = false,
  withCallingCode = true,
  containerButtonStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES.find((c) => c.code === 'GB'),
    [countryCode]
  );

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.callingCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectCountry = (country) => {
    onSelect({
      cca2: country.code,
      callingCode: [country.callingCode],
    });
    setModalVisible(false);
    setSearchQuery('');
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleSelectCountry(item)}
    >
      {withFlag && <Text style={styles.flag}>{item.flag}</Text>}
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        {withCallingCode && (
          <Text style={styles.countryCallingCode}>+{item.callingCode}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[containerButtonStyle, styles.buttonContainer]}
        onPress={() => setModalVisible(true)}
      >
        {withFlag && <Text style={styles.selectedFlag}>{selectedCountry.flag}</Text>}
        <Text style={styles.selectedText}>+{selectedCountry.callingCode}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={renderCountryItem}
              style={styles.countryList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({

    buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  selectedFlag: {
    fontSize: 18,
    marginRight: 6,
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // Responsive on mobile web: avoid overflowing viewport width
    width: '92vw',
    maxWidth: 520,
    minWidth: 280,
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    lineHeight: 24,
  },
  searchInput: {
    margin: 16,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    outlineStyle: 'none',
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    cursor: 'pointer',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryName: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    flexShrink: 1,
  },
  countryCallingCode: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flexShrink: 0,
  },
});

// Export as default
module.exports = CountryPicker;
module.exports.default = CountryPicker;

// Export the CountryCode type (stub)
module.exports.CountryCode = String;