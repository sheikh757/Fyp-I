import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../../env';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.6; // Increased width for vertical scroll
const imageHeight = cardWidth * 0.65; // Aspect ratio for images

const BrandProductsScreen = ({ route, navigation }) => {
  const { brandId, brandName = 'Brand Products' } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [brandId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/products/brand/${brandId}`);
      if (response.data.success) {
        console.log('Product images:', response.data.data.map(p => p.images));
        setProducts(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{brandName}</Text>
        <View style={styles.filterButtonPlaceholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {products.length > 0 ? (
          <View style={styles.productsContainer}>
            {products.map((product) => (
              <View key={product._id} style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product._id, product: product, brandId: brandId })}
                  activeOpacity={0.8}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ 
                        uri: product.images && product.images.length > 0 
                          ? `${API_URL.replace('/api', '')}${product.images[0]}`
                          : 'https://via.placeholder.com/150' 
                      }}
                      style={styles.productImage}
                      resizeMode="contain"
                      onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                    />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.productPrice}>PKR {product.price}</Text>
                    <Text style={styles.productCategory} numberOfLines={1}>
                      {product.category.replace(/_/g, ' ')}
                    </Text>
                    
                    <View style={styles.stockContainer}>
                      {product.stock > 0 ? (
                        <Text style={styles.inStock}>In Stock</Text>
                      ) : (
                        <Text style={styles.outOfStock}>Out of Stock</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.detailsButton} 
                  onPress={() => navigation.navigate('ProductDetail', { productId: product._id, product: product, brandId: brandId })}
                >
                  <Text style={styles.buttonText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textLight} />
            <Text style={styles.noProductsText}>No products found for this brand</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  filterButtonPlaceholder: {
    width: 24,
    height: 24,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  productsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productCard: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: imageHeight,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 10,
    paddingBottom: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  stockContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  inStock: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  outOfStock: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    width: '100%',
    gap: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  noProductsText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BrandProductsScreen;