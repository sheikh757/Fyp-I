import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import axios from 'axios';
import { API_URL } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      console.log('UserId:', userId); // Debug log

      if (!userId) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/orders/customer/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Orders response:', response.data); // Debug log

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch orders. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return colors.warning;
      case 'processing':
        return colors.primary;
      case 'shipped':
        return colors.info;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.text;
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

  if (orders.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="receipt-outline" size={64} color={colors.textLight} />
        <Text style={styles.emptyText}>No orders found</Text>
        <Text style={styles.emptySubText}>Your order history will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {orders.map((order) => (
          <TouchableOpacity
            key={order._id}
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { order })}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
              <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
            </View>

            <View style={styles.productInfo}>
              <Image
                source={{ uri: order.product.image || 'https://via.placeholder.com/80' }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={2}>
                  {order.product.name}
                </Text>
                <Text style={styles.productMeta}>
                  {order.product.selectedColor && `Color: ${order.product.selectedColor}`}
                  {order.product.selectedSize && ` • Size: ${order.product.selectedSize}`}
                  {` • Qty: ${order.product.quantity}`}
                </Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>
                PKR {order.totalPrice.toLocaleString()}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) }]}>
                <Text style={styles.statusText}>{order.orderStatus}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  productInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  productMeta: {
    fontSize: 14,
    color: colors.textLight,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrdersScreen;