import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../../env';
import { useIsFocused } from '@react-navigation/native';
import useBackHandler from '../../hooks/useBackHandler';

export default function BrandDashboardScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  useBackHandler(isFocused);
  console.log('BrandDashboardScreen: Received route.params:', route.params);
  const [brandName, setBrandName] = useState('Fashion Brand');
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [productFetchError, setProductFetchError] = useState(null);
  const [orderFetchError, setOrderFetchError] = useState(null);

  useEffect(() => {
    if (route.params?.brandName) {
      console.log('BrandDashboardScreen: Setting brandName from route params:', route.params.brandName);
      setBrandName(route.params.brandName);
    } else {
      console.log('BrandDashboardScreen: No brandName in route params. Falling back to AsyncStorage.');
      const getBrandNameFromStorage = async () => {
        try {
          const storedBrandName = await AsyncStorage.getItem('brandName');
          if (storedBrandName) {
            console.log('BrandDashboardScreen: Setting brandName from AsyncStorage:', storedBrandName);
            setBrandName(storedBrandName);
          }
        } catch (error) {
          console.error('Error fetching brand name from AsyncStorage:', error);
        }
      };
      getBrandNameFromStorage();
    }
  }, [route.params?.brandName]);

  useEffect(() => {
    const fetchBrandProductsCount = async (retryCount = 0) => {
      setLoadingProducts(true);
      setProductFetchError(null);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Log the request details for debugging
        console.log('Fetching products from:', `${API_URL}/v1/products`);
        
        const response = await axios.get(`${API_URL}/v1/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 second timeout
        });

        if (response.data.success) {
          setProductsCount(response.data.data.length);
        } else {
          throw new Error(response.data.error || 'Failed to fetch products count');
        }
      } catch (error) {
        console.error('Error fetching products count:', error);
        let errorMessage = 'Failed to load products';
        
        if (error.response) {
          // Server responded with error
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          console.error('Server response:', error.response.data);
          
          // Retry on 500 errors up to 3 times
          if (error.response.status === 500 && retryCount < 3) {
            console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
            setTimeout(() => fetchBrandProductsCount(retryCount + 1), 2000); // Retry after 2 seconds
            return;
          }
        } else if (error.request) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = error.message || 'An unexpected error occurred';
        }
        
        setProductFetchError(errorMessage);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchOrdersCount = async () => {
      setLoadingOrders(true);
      setOrderFetchError(null);
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

        console.log('Orders Count API Response:', response.data);

        if (response.data.success) {
          setOrdersCount(response.data.data.length);
        } else {
          throw new Error(response.data.error || 'Failed to fetch orders count');
        }
      } catch (error) {
        console.error('Error fetching orders count:', error);
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
        
        setOrderFetchError(errorMessage);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchBrandProductsCount();
    fetchOrdersCount();
  }, []);

  const stats = {
    orders: loadingOrders ? '...' : orderFetchError ? 'Error' : ordersCount,
    revenue: 12500,
    products: loadingProducts ? '...' : productFetchError ? 'Error' : productsCount,
    customers: 89
  };

  const recentOrders = [
    { id: 1, customer: 'John Doe', items: 2, amount: 199.99, status: 'Processing' },
    { id: 2, customer: 'Jane Smith', items: 1, amount: 89.99, status: 'Shipped' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hello, {brandName}</Text>
            <Text style={styles.subGreeting}>Manage your business</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={40} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cart" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{stats.orders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color={colors.primary} />
          <Text style={styles.statValue}>${stats.revenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="shirt" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{stats.products}</Text>
          <Text style={styles.statLabel}>Products</Text>
          {loadingProducts && <ActivityIndicator size="small" color={colors.primary} style={styles.loadingStatIndicator} />}
          {productFetchError && <Text style={styles.statErrorText}>{productFetchError}</Text>}
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{stats.customers}</Text>
          <Text style={styles.statLabel}>Customers</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ProductsDrawer', { screen: 'Products' })}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ManagePrices')}
          >
            <Ionicons name="pricetag" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Manage Prices</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Sales')}
          >
            <Ionicons name="trending-up" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('StoreDrawer', { screen: 'Store' })}
          >
            <Ionicons name="storefront" size={24} color={colors.primary} />
            <Text style={styles.actionText}>My Store</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentOrders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.customerName}>{order.customer}</Text>
              <Text style={styles.orderDetails}>{order.items} items • ${order.amount}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: order.status === 'Processing' ? '#FFF3E0' : '#E3F2FD' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: order.status === 'Processing' ? '#F57C00' : '#1976D2' }
              ]}>
                {order.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory Alert */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory Alert</Text>
        <View style={styles.alertCard}>
          <Ionicons name="warning" size={24} color="#F44336" />
          <View style={styles.alertInfo}>
            <Text style={styles.alertTitle}>Low Stock Items</Text>
            <Text style={styles.alertText}>5 products are running low on stock</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.alertAction}>View</Text>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#fff',
  },
  statCard: {
    width: '50%',
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 5,
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
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
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  orderDetails: {
    color: '#666',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  alertInfo: {
    flex: 1,
    marginLeft: 15,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  alertText: {
    color: '#666',
    marginTop: 5,
  },
  alertAction: {
    color: colors.primary,
    fontWeight: '500',
  },
  loadingStatIndicator: {
    marginTop: 5,
  },
  statErrorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 5,
    textAlign: 'center',
  },
}); 