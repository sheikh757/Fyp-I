import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../env';

const BrandOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
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

  const updateOrderStatus = async (newStatus) => {
    if (!selectedOrder) return;

    setUpdatingStatus(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        `${API_URL}/orders/${selectedOrder._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === selectedOrder._id 
            ? { ...order, orderStatus: newStatus }
            : order
        ));
        setStatusModalVisible(false);
        Alert.alert('Success', 'Order status updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'processing':
        return '#4A90E2';
      case 'shipped':
        return '#4CAF50';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const StatusUpdateModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={statusModalVisible}
      onRequestClose={() => setStatusModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Order Status</Text>
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                selectedOrder?.orderStatus === status && styles.selectedStatus
              ]}
              onPress={() => updateOrderStatus(status)}
              disabled={updatingStatus}
            >
              <Text style={[
                styles.statusOptionText,
                selectedOrder?.orderStatus === status && styles.selectedStatusText
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setStatusModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Clothing Orders</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.filterSection}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={20} color="#666" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="search" size={20} color="#666" />
              <Text style={styles.filterText}>Search</Text>
            </TouchableOpacity>
          </View>

          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No orders found</Text>
            </View>
          ) : (
            orders.map((order) => (
              <TouchableOpacity 
                key={order._id} 
                style={styles.orderCard}
                onPress={() => {
                  setSelectedOrder(order);
                  setStatusModalVisible(true);
                }}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) }]}>
                    <Text style={styles.statusText}>{order.orderStatus}</Text>
                  </View>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.customerName}>{order.customerInfo.fullName}</Text>
                  <View style={styles.itemsList}>
                    <Text style={styles.itemText}>
                      • {order.product.name} 
                      {order.product.selectedSize && ` (Size: ${order.product.selectedSize})`}
                      {order.product.selectedColor && ` - ${order.product.selectedColor}`}
                      x{order.product.quantity}
                    </Text>
                  </View>
                  <Text style={styles.deliveryAddress}>
                    <Ionicons name="location-outline" size={16} color="#666" /> {order.customerInfo.address}
                  </Text>
                  <Text style={styles.orderInfo}>Total: PKR {order.totalPrice.toLocaleString()}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
                </View>
                <View style={styles.orderActions}>
                  <Text style={styles.tapToUpdateText}>Tap to update status</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <StatusUpdateModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  filterSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  filterText: {
    marginLeft: 5,
    color: '#666',
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
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
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
  orderDetails: {
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemsList: {
    marginBottom: 8,
  },
  itemText: {
    color: '#666',
    marginBottom: 4,
  },
  deliveryAddress: {
    color: '#666',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInfo: {
    color: '#666',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  orderDate: {
    color: '#999',
    fontSize: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  viewButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginRight: 5,
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  selectedStatus: {
    backgroundColor: '#FF6B6B',
  },
  statusOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  selectedStatusText: {
    color: 'white',
  },
  closeButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tapToUpdateText: {
    color: '#666',
    marginRight: 5,
    fontSize: 14,
  },
});

export default BrandOrdersScreen; 