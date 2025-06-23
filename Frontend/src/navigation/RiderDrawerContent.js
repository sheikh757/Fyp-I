import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

const RiderDrawerContent = (props) => {
  const [riderName, setRiderName] = useState('Rider');

  useEffect(() => {
    const loadRiderName = async () => {
      const name = await AsyncStorage.getItem('riderName');
      if (name) {
        setRiderName(name);
      }
    };
    loadRiderName();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.multiRemove(['token', 'userId']);
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'RoleSelection' }],
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Ionicons name="person-circle-outline" size={60} color={colors.primary} />
          <Text style={styles.drawerHeaderText}>{riderName}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={colors.white} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    marginBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    padding: 15,
    margin: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default RiderDrawerContent; 