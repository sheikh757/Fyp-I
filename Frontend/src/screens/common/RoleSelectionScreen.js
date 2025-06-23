import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const RoleSelectionScreen = ({ navigation }) => {
  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Shop from your favorite fashion brands',
      icon: 'shirt-outline',
    },
    {
      id: 'rider',
      title: 'Rider',
      description: 'Deliver fashion items and earn money',
      icon: 'bicycle-outline',
    },
    {
      id: 'brand',
      title: 'Brand',
      description: 'Manage your fashion brand and orders',
      icon: 'storefront-outline',
    },
  ];

  const handleRoleSelect = (roleId) => {
    navigation.navigate('Welcome', { userType: roleId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you want to use FashionDelivery</Text>
        </View>

        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={styles.roleCard}
              onPress={() => handleRoleSelect(role.id)}
            >
              <View style={styles.roleIconContainer}>
                <Ionicons name={role.icon} size={40} color={colors.primary} />
              </View>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rolesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default RoleSelectionScreen; 