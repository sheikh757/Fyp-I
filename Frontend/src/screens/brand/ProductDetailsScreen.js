import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image source={{ uri: product.images[0] }} style={styles.productImage} resizeMode="contain" />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-off" size={100} color={colors.lightgray} />
            <Text style={styles.noImageText}>No Image Available</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>PKR {product.price}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="cube" size={20} color={colors.primary} />
            <Text style={styles.metaText}>Stock: {product.stock}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="grid" size={20} color={colors.primary} />
            <Text style={styles.metaText}>Category: {product.category.split('_').join(' ')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.sectionTitle}>Additional Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Brand:</Text>
          <Text style={styles.detailValue}>{product.brand?.name || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created At:</Text>
          <Text style={styles.detailValue}>{new Date(product.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Updated:</Text>
          <Text style={styles.detailValue}>{new Date(product.updatedAt).toLocaleDateString()}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit Product')}>
            <Ionicons name="pencil" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Edit Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => console.log('Delete Product')}>
            <Ionicons name="trash" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Delete Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
    height: width * 0.8, // 80% of screen width
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: colors.lightgray,
    marginTop: 10,
    fontSize: 16,
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: colors.lightgray + '30',
    paddingVertical: 10,
    borderRadius: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 5,
    fontSize: 16,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProductDetailsScreen; 