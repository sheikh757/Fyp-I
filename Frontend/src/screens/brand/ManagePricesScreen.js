import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { useProducts } from '../../context/ProductContext';

const ManagePricesScreen = ({ navigation }) => {
  const { products, updateProduct } = useProducts();

  const handlePriceChange = (id, newPrice) => {
    updateProduct(id, { price: newPrice });
  };

  const handleStockChange = (id, newStock) => {
    updateProduct(id, { stock: newStock });
  };

  const handleSave = () => {
    Alert.alert(
      'Success',
      'Prices updated successfully',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Prices</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="pricetag-outline" size={64} color={colors.primary} />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubText}>Add products first to manage their prices</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Prices</Text>
      </View>

      <View style={styles.content}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.categoryText}>{product.category}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (PKR)</Text>
              <TextInput
                style={styles.input}
                value={product.price}
                onChangeText={(text) => handlePriceChange(product.id, text)}
                keyboardType="numeric"
                placeholder="Enter price"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={product.stock}
                onChangeText={(text) => handleStockChange(product.id, text)}
                keyboardType="numeric"
                placeholder="Enter stock quantity"
              />
            </View>

            <View style={styles.colorsContainer}>
              <Text style={styles.label}>Colors</Text>
              <View style={styles.colorList}>
                {product.colors.map((color, index) => (
                  <View
                    key={index}
                    style={[styles.colorDot, { backgroundColor: color }]}
                  />
                ))}
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  colorsContainer: {
    marginBottom: 10,
  },
  colorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ManagePricesScreen; 