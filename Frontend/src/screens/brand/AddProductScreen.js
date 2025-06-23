import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { useProducts } from '../../context/ProductContext';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '../../env';

const AddProductScreen = ({ navigation }) => {
  const { addProduct } = useProducts();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    colors: [],
    images: [],
    gender: 'unisex',
    stitched: 'stitched',
    colorsInput: '',
    sizesInput: '',
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const categories = [
    'Stitched',
    'Unstitched',
    'Accessories',
    'Footwear',
    'Bags',
  ];

  const colorOptions = [
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Purple', value: '#800080' },
    { name: 'Pink', value: '#FFC0CB' },
  ];

  const handleAddColor = () => {
    if (selectedColor && !product.colors.includes(selectedColor)) {
      setProduct({
        ...product,
        colors: [...product.colors, selectedColor],
      });
      setSelectedColor('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setProduct({
      ...product,
      colors: product.colors.filter(color => color !== colorToRemove),
    });
  };

  const handleAddImage = async () => {
    try {
      console.log('Starting image upload process...');
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Launch image picker with updated MediaType
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log('Image picker result:', result);

      if (!result.canceled) {
        // Create form data
        const formData = new FormData();
        const imageUri = Platform.OS === 'ios' ? result.assets[0].uri.replace('file://', '') : result.assets[0].uri;
        console.log('Image URI:', imageUri);
        
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });

        // Log the upload URL
        const uploadUrl = `${API_URL.replace('/api', '/api/v1')}/upload/upload`;
        console.log('Upload URL:', uploadUrl);
        console.log('FormData:', formData);

        // Upload image with correct URL
        console.log('Sending upload request...');
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          transformRequest: (data, headers) => {
            console.log('Request data:', data);
            console.log('Request headers:', headers);
            return data;
          },
        });
        console.log('Upload response:', response.data);

        if (response.data.success) {
          setProduct({
            ...product,
            images: [...product.images, response.data.imageUrl],
          });
          Alert.alert('Success', 'Image uploaded successfully');
        } else {
          console.log('Upload failed:', response.data);
          Alert.alert('Error', 'Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
      Alert.alert('Error', `Failed to upload image: ${error.message}`);
    }
  };

  const validateForm = () => {
    if (!product.name) {
      Alert.alert('Error', 'Please enter product name');
      return false;
    }
    if (!product.price) {
      Alert.alert('Error', 'Please enter product price');
      return false;
    }
    if (!product.stock) {
      Alert.alert('Error', 'Please enter stock quantity');
      return false;
    }
    if (!product.category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (product.colors.length === 0) {
      Alert.alert('Error', 'Please add at least one color');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const productDetails = {
        name: product.name,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        category: product.category,
        description: product.description,
        colors: product.colors,
        sizes: product.sizesInput.split(',').map(s => s.trim()),
        gender: product.gender,
        stitched: product.stitched === 'stitched',
        images: product.images,
      };
      addProduct(productDetails);
      Alert.alert(
        'Success',
        'Product added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Product</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Summer T-Shirt"
            value={product.name}
            onChangeText={(text) => setProduct({ ...product, name: text })}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detailed description of the product"
            value={product.description}
            onChangeText={(text) => setProduct({ ...product, description: text })}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 29.99"
            value={product.price}
            onChangeText={(text) => setProduct({ ...product, price: text })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Stock Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 100"
            value={product.stock}
            onChangeText={(text) => setProduct({ ...product, stock: text })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={product.gender}
              onValueChange={(itemValue) => setProduct({ ...product, gender: itemValue })}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Unisex" value="unisex" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={product.category}
              onValueChange={(itemValue) => {
                setProduct({ ...product, category: itemValue });
                setSelectedCategory(itemValue);
              }}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="-- Select Category --" value="" />
              <Picker.Item label="T-Shirts" value="tshirts" />
              <Picker.Item label="Jeans" value="jeans" />
              <Picker.Item label="Dresses" value="dresses" />
              <Picker.Item label="Jackets" value="jackets" />
              <Picker.Item label="Footwear" value="footwear" />
              <Picker.Item label="Accessories" value="accessories" />
            </Picker>
          </View>

          <Text style={styles.label}>Stitched / Unstitched</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={product.stitched}
              onValueChange={(itemValue) => setProduct({ ...product, stitched: itemValue })}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Stitched" value="stitched" />
              <Picker.Item label="Unstitched" value="unsticthed" />
            </Picker>
          </View>

          <Text style={styles.label}>Colors (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Red, Blue, Black"
            value={product.colorsInput}
            onChangeText={(text) => setProduct({ ...product, colorsInput: text })}
          />

          <Text style={styles.label}>Sizes (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., S, M, L, XL or 30, 32, 34"
            value={product.sizesInput}
            onChangeText={(text) => setProduct({ ...product, sizesInput: text })}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Add Product</Text>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  addIcon: {
    // Additional styling for the icon if needed
  },
});

export default AddProductScreen; 