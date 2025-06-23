import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { API_URL } from '../../../env';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Add debug logging for product images
  useEffect(() => {
    if (product) {
      console.log('Product detail images:', product.images);
    }
  }, [product]);

  if (!product) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Product details not available.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor && product.colors && product.colors.length > 0) {
      Alert.alert('Selection Required', 'Please select a color before adding to cart.');
      return;
    }
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      Alert.alert('Selection Required', 'Please select a size before adding to cart.');
      return;
    }

    const cartItem = {
      productId: product._id,
      brandId: route.params.brandId,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      quantity: quantity,
    };

    Alert.alert(
      'Added to Cart',
      `'${cartItem.name}' (Color: ${cartItem.selectedColor || 'N/A'}, Size: ${cartItem.selectedSize || 'N/A'}) has been added to your cart.`
    );
    console.log('Added to cart:', cartItem);
    navigation.navigate('Checkout', { cartItem: cartItem });
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: product.images && product.images.length > 0 
                ? `${API_URL.replace('/api', '')}${product.images[0]}`
                : 'https://via.placeholder.com/400' 
            }}
            style={styles.productImage}
            resizeMode="contain"
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>New Arrival</Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>PKR {product.price.toLocaleString()}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.ratingText}>4.8 (128)</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCategory}>{product.category.replace(/_/g, ' ')}</Text>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Ionicons name="pricetag-outline" size={18} color={product.stock > 0 ? colors.success : colors.error} />
            <Text style={[styles.stockText, { color: product.stock > 0 ? colors.success : colors.error }]}>
              {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.productDescription}>
              {product.description || 'No description available.'}
            </Text>
          </View>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Color</Text>
              <View style={styles.colorOptionsContainer}>
                {product.colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.toLowerCase() },
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={styles.sizeOptionsContainer}>
                {product.sizes.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeOption,
                      selectedSize === size && styles.selectedSizeOption,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[
                      styles.sizeText,
                      selectedSize === size && styles.selectedSizeText,
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={quantity <= 1 ? colors.textLight : colors.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Ionicons name="add" size={20} color={quantity >= product.stock ? colors.textLight : colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={() => Alert.alert('Added to Wishlist')}
        >
          <Ionicons name="heart-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <Ionicons name="cart" size={20} color={colors.white} />
          <Text style={styles.addToCartButtonText}>
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  productImage: {
    width: width * 0.9,
    height: width * 0.9,
  },
  imageBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  imageBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 12,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedColorOption: {
    borderColor: colors.green,
    shadowColor: colors.primary,
  },
  sizeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeOption: {
    minWidth: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedSizeOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedSizeText: {
    color: colors.white,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 6,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    width: 40,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  wishlistButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom:20,
  },
  addToCartButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
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
    fontWeight: '500',
  },
});

export default ProductDetailScreen;