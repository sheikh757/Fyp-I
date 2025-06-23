import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import axios from 'axios';
import { API_URL } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = width / numColumns - 20;

const StoreScreen = ({ route }) => {
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
  });

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const token = await AsyncStorage.getItem('token');
      console.log('Token retrieved:', token ? 'Token exists' : 'No token found');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Making API request to:', `${API_URL}/products`);
      const response = await axios.get(`${API_URL}/v1/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response Status:', response.status);
      console.log('API Response Data:', response.data);

      if (response.data.success) {
        setProducts(response.data.data);
        calculateStats(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error in fetchProducts:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        headers: error.config?.headers,
      });

      let errorMessage = 'Failed to fetch products';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Authentication failed. Please login again.';
            break;
          case 404:
            errorMessage = 'Products endpoint not found. Please check API configuration.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.error || error.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }

      setError(errorMessage);
      setProducts([]);
      setStats({ totalProducts: 0, totalStock: 0, totalValue: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (productList) => {
    const stats = productList.reduce(
      (acc, product) => ({
        totalProducts: acc.totalProducts + 1,
        totalStock: acc.totalStock + product.stock,
        totalValue: acc.totalValue + product.price * product.stock,
      }),
      { totalProducts: 0, totalStock: 0, totalValue: 0 }
    );
    setStats(stats);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProductCard = (product) => {
    console.log('Product image URL:', product.images[0]);
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

    return (
    <TouchableOpacity
      key={product._id}
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product })}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ 
              uri: product.images && product.images.length > 0 
                ? `${API_URL.replace('/api', '')}${product.images[0]}`
                : 'https://via.placeholder.com/400' 
            }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={tileSize / 2} color={colors.lightgray} />
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        {product.stock === 0 && (
          <View style={styles.soldOutOverlay}>
            <Text style={styles.soldOutText}>Sold Out</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>PKR {product.price}</Text>
        <View style={styles.productMeta}>
          <Text style={styles.stockText}>
            Stock: {product.stock}
          </Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {product.category.split('_').join(' ')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Store Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Store</Text>
       
      </View>

      {/* Store Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cube" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="pricetag" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{stats.totalStock}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={24} color={colors.primary} />
          <Text style={styles.statValue}>PKR {stats.totalValue}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
      </View>

      {/* Products Grid */}
      <View style={styles.productsGrid}>
        {products.map(renderProductCard)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: colors.white,
    borderBottomWidth: 0,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: colors.white,
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: colors.white,
    marginBottom: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  productCard: {
    width: tileSize,
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: tileSize,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  soldOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    textTransform: 'capitalize',
  },
});

export default StoreScreen; 