import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const AnalyticsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Brand Analytics</Text>
        <View style={styles.card}>
          <Text style={styles.metricLabel}>Total Sales</Text>
          <Text style={styles.metricValue}>PKR 0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.metricLabel}>Total Products</Text>
          <Text style={styles.metricValue}>0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.metricLabel}>Orders This Month</Text>
          <Text style={styles.metricValue}>0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.metricLabel}>Top Selling Product</Text>
          <Text style={styles.metricValue}>-</Text>
        </View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default AnalyticsScreen; 