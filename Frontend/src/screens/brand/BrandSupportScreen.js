import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const BrandSupportScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqCard}>
          <Text style={styles.faqQ}>Q: How do I add a new product?</Text>
          <Text style={styles.faqA}>A: Go to the dashboard and tap on "Add Product" in Quick Actions.</Text>
        </View>
        <View style={styles.faqCard}>
          <Text style={styles.faqQ}>Q: How do I update my business details?</Text>
          <Text style={styles.faqA}>A: Go to Profile and tap "Update Profile".</Text>
        </View>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('mailto:support@yourapp.com')}>
          <Ionicons name="mail" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  faqQ: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  faqA: {
    color: '#666',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default BrandSupportScreen; 