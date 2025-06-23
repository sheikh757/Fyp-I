import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

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
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Status */}
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) }]}>
              <Text style={styles.statusText}>{order.orderStatus}</Text>
            </View>
            <Text style={styles.orderDate}>Ordered on {formatDate(order.orderDate)}</Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.productCard}>
            <Image
              source={{ uri: order.product.image || 'https://via.placeholder.com/150' }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{order.product.name}</Text>
              <Text style={styles.productMeta}>
                {order.product.selectedColor && `Color: ${order.product.selectedColor}`}
                {order.product.selectedSize && ` • Size: ${order.product.selectedSize}`}
                {` • Quantity: ${order.product.quantity}`}
              </Text>
              <Text style={styles.productPrice}>
                PKR {order.product.price.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{order.customerInfo.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{order.customerInfo.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{order.customerInfo.phoneNumber}</Text>
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>Payment Method: {order.paymentMethod}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color={colors.textLight} />
              <Text style={styles.infoText}>Total Amount: PKR {order.totalPrice.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
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
  statusContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  productMeta: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
});

export default OrderDetailScreen; 