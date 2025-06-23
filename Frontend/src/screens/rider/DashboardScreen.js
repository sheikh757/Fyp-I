import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function RiderDashboardScreen({ navigation }) {
  const activeDeliveries = [
    { id: 1, customer: 'John Doe', address: '123 Main St', items: 2, distance: '2.5 km' },
    { id: 2, customer: 'Jane Smith', address: '456 Oak Ave', items: 1, distance: '1.8 km' },
  ];

  const earnings = {
    today: 45.50,
    week: 320.75,
    month: 1250.00
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hello, Mike</Text>
            <Text style={styles.subGreeting}>Ready to deliver?</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={40} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons name="radio" size={24} color="#4CAF50" />
          <Text style={styles.statusText}>Online</Text>
        </View>
        <TouchableOpacity style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>Go Offline</Text>
        </TouchableOpacity>
      </View>

      {/* Earnings Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Earnings</Text>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsAmount}>${earnings.today}</Text>
          <View style={styles.earningsBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>This Week</Text>
              <Text style={styles.breakdownValue}>${earnings.week}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>This Month</Text>
              <Text style={styles.breakdownValue}>${earnings.month}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Active Deliveries */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Deliveries</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {activeDeliveries.map((delivery) => (
          <TouchableOpacity key={delivery.id} style={styles.deliveryCard}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.customerName}>{delivery.customer}</Text>
              <Text style={styles.address}>{delivery.address}</Text>
              <View style={styles.deliveryDetails}>
                <Text style={styles.detailText}>{delivery.items} items</Text>
                <Text style={styles.detailText}>{delivery.distance}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.navigateButton}>
              <Ionicons name="navigate" size={24} color={colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="wallet" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="stats-chart" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 15,
    padding: 5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  profileButton: {
    padding: 5,
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  toggleButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: colors.text,
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 16,
  },
  earningsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  earningsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    flex: 1,
  },
  breakdownLabel: {
    color: '#666',
    fontSize: 14,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 5,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  deliveryInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  address: {
    color: '#666',
    marginTop: 5,
  },
  deliveryDetails: {
    flexDirection: 'row',
    marginTop: 5,
  },
  detailText: {
    color: '#666',
    marginRight: 15,
  },
  navigateButton: {
    padding: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  actionText: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
  },
}); 