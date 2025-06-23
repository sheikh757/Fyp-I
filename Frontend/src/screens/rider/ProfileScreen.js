import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { API_URL } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ route }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log('ProfileScreen (Rider): Retrieved userId from AsyncStorage:', userId);

        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          console.error('ProfileScreen (Rider): userId is null or undefined after retrieval.');
          return;
        }

        console.log('ProfileScreen (Rider): Attempting to fetch profile for userId:', userId);
        const response = await fetch(`${API_URL}/rider/profile/${userId}`);
        const data = await response.json();
        console.log('ProfileScreen (Rider): API response data:', data);

        if (response.ok) {
          setUserData(data);
          setEditedData(data);
          console.log('ProfileScreen (Rider): Profile data set successfully.', data);
        } else {
          setError(data.message || 'Failed to fetch profile.');
          console.error('ProfileScreen (Rider): Failed to fetch profile:', data.message);
        }
      } catch (err) {
        console.error('ProfileScreen (Rider) - Fetch Profile Error:', err);
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
        console.log('ProfileScreen (Rider): Loading finished.');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('ProfileScreen (Rider) - Update: Retrieved userId from AsyncStorage:', userId);

      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        console.error('ProfileScreen (Rider) - Update: userId is null or undefined before update.');
        return;
      }

      console.log('ProfileScreen (Rider) - Update: Sending update for userId:', userId, 'with data:', editedData);
      const response = await fetch(`${API_URL}/rider/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      const data = await response.json();
      console.log('ProfileScreen (Rider) - Update: API response data:', data);

      if (response.ok) {
        setUserData(editedData);
        setIsEditing(false);
        Alert.alert('Success', data.message || 'Profile updated successfully.');
        console.log('ProfileScreen (Rider) - Update: Profile updated successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile.');
        console.error('ProfileScreen (Rider) - Update: Failed to update profile:', data.message);
      }
    } catch (err) {
      console.error('ProfileScreen (Rider) - Update Error:', err);
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text>No profile data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? "close" : "create"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.name}
              onChangeText={(text) => setEditedData({...editedData, name: text})}
              placeholder="Enter your full name"
            />
          ) : (
            <Text style={styles.value}>{userData.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.email}
              onChangeText={(text) => setEditedData({...editedData, email: text})}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{userData.email}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.phone || ''}
              onChangeText={(text) => setEditedData({...editedData, phone: text})}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{userData.phone || 'N/A'}</Text>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={handleUpdate}
          >
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    padding: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 