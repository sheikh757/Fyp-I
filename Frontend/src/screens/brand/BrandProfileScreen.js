import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { API_URL } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const BrandProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log('BrandProfileScreen: Retrieved userId from AsyncStorage:', userId);

        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          console.error('BrandProfileScreen: userId is null or undefined after retrieval.');
          return;
        }

        console.log('BrandProfileScreen: Attempting to fetch profile for userId:', userId);
        const response = await fetch(`${API_URL}/brand/profile/${userId}`);
        const data = await response.json();
        console.log('BrandProfileScreen: API response data:', data);

        if (response.ok) {
          setUserData(data);
          setEditedData(data);
          console.log('BrandProfileScreen: Profile data set successfully.', data);
        } else {
          setError(data.message || 'Failed to fetch profile.');
          console.error('BrandProfileScreen: Failed to fetch profile:', data.message);
        }
      } catch (err) {
        console.error('BrandProfileScreen - Fetch Profile Error:', err);
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
        console.log('BrandProfileScreen: Loading finished.');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('BrandProfileScreen - Update: Retrieved userId from AsyncStorage:', userId);

      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        console.error('BrandProfileScreen - Update: userId is null or undefined before update.');
        return;
      }

      console.log('BrandProfileScreen - Update: Sending update for userId:', userId, 'with data:', editedData);
      const response = await fetch(`${API_URL}/brand/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      const data = await response.json();
      console.log('BrandProfileScreen - Update: API response data:', data);

      if (response.ok) {
        setUserData(editedData);
        setModalVisible(false);
        Alert.alert('Success', data.message || 'Profile updated successfully.');
        console.log('BrandProfileScreen - Update: Profile updated successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile.');
        console.error('BrandProfileScreen - Update: Failed to update profile:', data.message);
      }
    } catch (err) {
      console.error('BrandProfileScreen - Update Error:', err);
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={24} color={colors.primary} />
              <Text style={styles.infoText}>{userData.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={24} color={colors.primary} />
              <Text style={styles.infoText}>{userData.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={24} color={colors.primary} />
              <Text style={styles.infoText}>{userData.phone || 'N/A'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Profile</Text>
              <TextInput
                style={styles.input}
                value={editedData.name}
                onChangeText={(text) => setEditedData({ ...editedData, name: text })}
                placeholder="Business Name"
              />
              <TextInput
                style={styles.input}
                value={editedData.email}
                onChangeText={(text) => setEditedData({ ...editedData, email: text })}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={editedData.phone || ''}
                onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
                placeholder="Phone"
                keyboardType="phone-pad"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 20,
    backgroundColor: '#FF6B6B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: colors.text,
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BrandProfileScreen;