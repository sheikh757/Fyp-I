import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../../env';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Orders API Response:', response.data);

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      let errorMessage = 'Failed to load orders';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'processing':
        return '#007AFF';
      case 'shipped':
        return '#4CD964';
      case 'delivered':
        return '#4CD964';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>
      <View style={styles.content}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No orders yet</Text>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity 
              key={order._id}
              style={styles.orderCard}
              onPress={() => navigation.navigate('OrderDetails', { order })}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) }]}>
                  <Text style={styles.statusText}>{order.orderStatus}</Text>
                </View>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.customerName}>{order.customerInfo.fullName}</Text>
                <Text style={styles.orderTotal}>PKR {order.totalPrice.toLocaleString()}</Text>
              </View>
              <View style={styles.itemsContainer}>
                <Text style={styles.itemText}>
                  {order.product.quantity}x {order.product.name}
                  {order.product.selectedColor && ` (${order.product.selectedColor})`}
                  {order.product.selectedSize && ` - Size: ${order.product.selectedSize}`}
                </Text>
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryText}>
                  <Ionicons name="location-outline" size={16} color="#666" /> {order.customerInfo.address}
                </Text>
                <Text style={styles.deliveryText}>
                  <Ionicons name="call-outline" size={16} color="#666" /> {order.customerInfo.phoneNumber}
                </Text>
              </View>
            </TouchableOpacity>
          ))
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  deliveryInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreen; 