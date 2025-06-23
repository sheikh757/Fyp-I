import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const OrdersScreen = () => {
  const orders = [
    {
      id: '1',
      customer: 'John Doe',
      address: '123 Main St',
      items: 2,
      status: 'In Progress',
    },
    {
      id: '2',
      customer: 'Jane Smith',
      address: '456 Oak Ave',
      items: 3,
      status: 'Pending',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
        </View>
        <View style={styles.content}>
          {orders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={[
                  styles.status,
                  { color: order.status === 'In Progress' ? '#FF6B6B' : '#666' }
                ]}>
                  {order.status}
                </Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.customerName}>{order.customer}</Text>
                <Text style={styles.address}>{order.address}</Text>
                <Text style={styles.items}>{order.items} items</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  orderCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderDetails: {
    marginBottom: 15,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  items: {
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrdersScreen; 