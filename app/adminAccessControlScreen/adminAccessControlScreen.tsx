import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import styles from './adminAccessControlScreenStyles';
import { PageLayout } from '../pageLayoutProps';
import Header from '@/components/Header';
import { ADMIN_ACCESS_CONTROL_SCREEN_TITLE } from '../config/stringLiterals';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config/colors';

const adminAccessControlScreen = () => {
  const allUsersData = [{
    name: "Kataleen M. Dennis",
    phone: "9876543210",
    email: "kataleena@gmail.com"
  },
  {
    name: "Jennifer",
    phone: "9876543211",
    email: "jennifer@gmail.com"
  },
  {
    name: "Levi",
    phone: "9876543212",
    email: "levi@gmail.com"
  },
  {
    name: "Naruto Uzumaki",
    phone: "9876543213",
    email: "naruto@gmail.com"
  },
  {
    name: "Eren Yeager",
    phone: "9876543214",
    email: "eren@gmail.com"
  },
  {
    name: "Inaba",
    phone: "9876543215",
    email: "inaba@gmail.com"
  },
  {
    name: "Aaron",
    phone: "9876543216",
    email: "aaron@gmail.com"
  },
  {
    name: "Tristan Caine",
    phone: "9876543217",
    email: "tristan@gmail.com"
  },
  {
    name: "Zade Meadows",
    phone: "9876543218",
    email: "zade@gmail.com"
  },
  {
    name: "Kiara",
    phone: "9876543219",
    email: "kiara@gmail.com"
  },
  {
    name: "Hannah",
    phone: "9876543221",
    email: "Hannah@gmail.com"
  },
  {
    name: "Clara",
    phone: "9876543222",
    email: "Clara@gmail.com"
  },
]; 

const [displayUser, setUser] = useState(false);
const [accessList, setAccessList] = useState(Array(allUsersData.length).fill(false));
const [searchText, setSearchText] = useState('');

const toggleAccess = (index: number) => {
  const newAccessList = [...accessList];
  newAccessList[index] = !newAccessList[index];
  setAccessList(newAccessList);
}

const usersToShow = displayUser ? allUsersData : allUsersData.slice(0, 10);

  return (
   <PageLayout
      hasHeader
      hasFooter = {false}
      scrollable
      headerComponent={<Header headerText={ADMIN_ACCESS_CONTROL_SCREEN_TITLE} />}
   >
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search user..."
            placeholderTextColor={colors.placeholdergrey}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Ionicons name="search" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.row, styles.tableHeader]}>
              <Text style={[styles.cell,styles.headerText]}>Name</Text>
              <Text style={[styles.cell,styles.headerText]}>Ph. No</Text>
              <Text style={[styles.cell,styles.headerText]}>Email</Text>
              <Text style={[styles.cell,styles.headerText]}>Access</Text>
        </View>
        <FlatList
        data={usersToShow}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.nameCell}>{item.name}</Text>
            <Text style={styles.phoneCell}>{item.phone}</Text>
            <Text style={styles.emailCell}>{item.email}</Text>
            <TouchableOpacity
              style={styles.checkboxCell}
              onPress={() => toggleAccess(index)}
            >
              {accessList[index] && (
                <Ionicons name="checkmark" size={12} color="black" />
              )}
            </TouchableOpacity>
          </View>
        )}
      />
      {!displayUser && (
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => setUser(true)}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      )}
   </PageLayout>
  );
};

export default adminAccessControlScreen;
