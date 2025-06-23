import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ route, navigation }) => {
  const { cartItem } = route.params;

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  useEffect(() => {
    if (!cartItem) {
      Alert.alert('Error', 'No product data found for checkout.');
      navigation.goBack();
    }
  }, [cartItem]);

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !address.trim() || !phoneNumber.trim()) {
      Alert.alert('Missing Info', 'Please fill in all your details.');
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number (at least 10 digits).');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Error', 'Customer not logged in. Please log in to place an order.');
      return;
    }

    const orderDetails = {
      customerInfo: {
        fullName,
        address,
        phoneNumber,
      },
      product: {
        productId: cartItem.productId,
        brandId: cartItem.brandId,
        name: cartItem.name,
        price: cartItem.price,
        selectedColor: cartItem.selectedColor,
        selectedSize: cartItem.selectedSize,
        quantity: cartItem.quantity,
        image: cartItem.image,
      },
      paymentMethod,
      totalPrice: cartItem.price * cartItem.quantity,
      customerId: userId,
    };

    try {
      const response = await axios.post(`${API_URL}/orders`, orderDetails);
      if (response.data.success) {
        Alert.alert(
          'Order Placed!',
          `Thank you, ${fullName}! Your order for '${cartItem.name}' has been placed. Payment: ${paymentMethod}.`,
          [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]
        );
        console.log('Order Placed Successfully:', response.data.data);
      } else {
        Alert.alert('Order Failed', response.data.message || 'Something went wrong while placing your order.');
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      Alert.alert('Order Failed', error.response?.data?.message || 'Could not place order. Please try again.');
    }
  };

  if (!cartItem) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Loading product details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />{/* Placeholder for alignment */}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderItemContainer}>
            <Image
              source={{ uri: cartItem.image || 'https://via.placeholder.com/80' }}
              style={styles.orderItemImage}
              resizeMode="cover"
            />
            <View style={styles.orderItemDetails}>
              <Text style={styles.orderItemName} numberOfLines={2}>{cartItem.name}</Text>
              <Text style={styles.orderItemPrice}>PKR {cartItem.price.toLocaleString()}</Text>
              {cartItem.selectedColor && (
                <Text style={styles.orderItemInfo}>Color: {cartItem.selectedColor}</Text>
              )}
              {cartItem.selectedSize && (
                <Text style={styles.orderItemInfo}>Size: {cartItem.selectedSize}</Text>
              )}
              <Text style={styles.orderItemInfo}>Quantity: {cartItem.quantity}</Text>
            </View>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalPrice}>PKR {(cartItem.price * cartItem.quantity).toLocaleString()}</Text>
          </View>
        </View>

        {/* Customer Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Delivery Address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number (e.g., 03XX-XXXXXXX)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue, itemIndex) => setPaymentMethod(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Cash on Delivery" value="Cash on Delivery" />
              <Picker.Item label="Online Payment" value="Online Payment" />
            </Picker>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.white} />
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Ensure content isn't hidden by bottom bar
  },
  section: {
    marginBottom: 25,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },
  orderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  orderItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: colors.lightGray,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  orderItemInfo: {
    fontSize: 13,
    color: colors.textLight,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.inputBackground,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.inputBackground,
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.text,
  },
  pickerItem: {
    fontSize: 16,
    color: colors.text,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  placeOrderButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    gap: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  placeOrderButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default CheckoutScreen; 