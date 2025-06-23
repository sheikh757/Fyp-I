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
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../../../env';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProductScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
  });

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Pakistan-specific categories
  const categories = [
    // Men's Categories
    { label: 'Men: Kurta', value: 'men_kurta' },
    { label: 'Men: Shalwar Kameez', value: 'men_shalwar_kameez' },
    { label: 'Men: Waistcoat', value: 'men_waistcoat' },
    { label: 'Men: Sherwani', value: 'men_sherwani' },
    { label: 'Men: Pajama', value: 'men_pajama' },
    { label: 'Men: Churidar', value: 'men_churidar' },
    
    // Women's Categories
    { label: 'Women: Kurta', value: 'women_kurta' },
    { label: 'Women: Shalwar Kameez', value: 'women_shalwar_kameez' },
    { label: 'Women: Lehenga', value: 'women_lehenga' },
    { label: 'Women: Saree', value: 'women_saree' },
    { label: 'Women: Gharara', value: 'women_gharara' },
    { label: 'Women: Frock', value: 'women_frock' },
    
    // Unisex Categories
    { label: 'Unisex: Footwear', value: 'unisex_footwear' },
    { label: 'Unisex: Accessories', value: 'unisex_accessories' },
    { label: 'Unisex: Bags', value: 'unisex_bags' },
  ];

  // Pakistan-specific colors
  const colorOptions = [
    { label: 'White', value: 'white' },
    { label: 'Black', value: 'black' },
    { label: 'Navy Blue', value: 'navy_blue' },
    { label: 'Maroon', value: 'maroon' },
    { label: 'Bottle Green', value: 'bottle_green' },
    { label: 'Peach', value: 'peach' },
    { label: 'Gold', value: 'gold' },
    { label: 'Silver', value: 'silver' },
  ];

  // Pakistan-specific sizes
  const sizeOptions = {
    men_kurta: ['S', 'M', 'L', 'XL', 'XXL'],
    men_shalwar_kameez: ['S', 'M', 'L', 'XL', 'XXL'],
    men_waistcoat: ['34', '36', '38', '40', '42', '44'],
    men_sherwani: ['S', 'M', 'L', 'XL', 'XXL'],
    women_kurta: ['S', 'M', 'L', 'XL', 'XXL'],
    women_shalwar_kameez: ['S', 'M', 'L', 'XL', 'XXL'],
    women_lehenga: ['Free Size', 'S', 'M', 'L'],
    unisex_footwear: ['36', '37', '38', '39', '40', '41', '42'],
  };

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

  const handleSizeSelection = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const pickImage = async () => {
    if (product.images.length >= 5) {
      Alert.alert('Limit reached', 'You can upload maximum 5 images');
      return;
    }
  
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const takePhoto = async () => {
    if (product.images.length >= 5) {
      Alert.alert('Limit reached', 'You can upload maximum 5 images');
      return;
    }
  
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'image/jpeg',
        name: `product-${Date.now()}.jpg`
      });
      
      // Upload to your server
      const uploadResponse = await axios.post(
        `${API_URL}/v1/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (uploadResponse.data.success) {
        setProduct({
          ...product,
          images: [...product.images, uploadResponse.data.imageUrl],
        });
      } else {
        throw new Error(uploadResponse.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload image. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please check your internet connection.';
      } else if (!error.response) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else if (error.response.status === 413) {
        errorMessage += 'Image file is too large. Please choose a smaller image.';
      } else {
        errorMessage += error.response?.data?.error || error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...product.images];
    newImages.splice(index, 1);
    setProduct({ ...product, images: newImages });
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const validateForm = () => {
    const errors = [];
    
    if (!product.name) errors.push('Product name is required');
    if (!product.price) errors.push('Price is required');
    if (isNaN(product.price)) errors.push('Price must be a number');
    if (!product.stock) errors.push('Stock quantity is required');
    if (isNaN(product.stock)) errors.push('Stock must be a number');
    if (!product.category) errors.push('Category is required');
    if (product.colors.length === 0) errors.push('At least one color is required');
    if (selectedSizes.length === 0) errors.push('At least one size is required');
    if (product.images.length === 0) errors.push('At least one image is required');
    
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('Attempting to save product...');

    try {
      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please login again.');
        navigation.navigate('Login');
        return;
      }

      const productData = {
        name: product.name,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        category: product.category,
        description: product.description,
        colors: product.colors,
        sizes: selectedSizes,
        gender: product.gender,
        stitched: product.stitched === 'stitched',
        images: product.images,
        brand: userId // Using userId as brand ID
      };
      console.log('Product data being sent:', productData);

      const response = await axios.post(
        `${API_URL}/v1/products`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
          },
        }
      );

      if (response.data.success) {
        console.log('Product saved successfully. Response:', response.data);
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
      } else {
        console.log('Product save failed. Response:', response.data);
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Adding product...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Product</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Embroidered Lawn Suit"
                placeholderTextColor={colors.placeholder}
                value={product.name}
                onChangeText={(text) => setProduct({ ...product, name: text })}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detailed description of the product..."
                placeholderTextColor={colors.placeholder}
                value={product.description}
                onChangeText={(text) => setProduct({ ...product, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Price and Stock */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Price (PKR)*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 2499"
                  placeholderTextColor={colors.placeholder}
                  value={product.price}
                  onChangeText={(text) => setProduct({ ...product, price: text })}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Stock Quantity*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 50"
                  placeholderTextColor={colors.placeholder}
                  value={product.stock}
                  onChangeText={(text) => setProduct({ ...product, stock: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Gender and Category */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Gender*</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={product.gender}
                    onValueChange={(itemValue) => setProduct({ ...product, gender: itemValue })}
                    style={styles.picker}
                    dropdownIconColor={colors.text}
                  >
                    <Picker.Item label="Unisex" value="unisex" />
                    <Picker.Item label="Men" value="male" />
                    <Picker.Item label="Women" value="female" />
                  </Picker>
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Category*</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={product.category}
                    onValueChange={(itemValue) => setProduct({ ...product, category: itemValue })}
                    style={styles.picker}
                    dropdownIconColor={colors.text}
                  >
                    <Picker.Item label="-- Select Category --" value="" />
                    <Picker.Item label="Men's Wear" value="header_men" enabled={false} />
                    {categories.filter(cat => cat.value.startsWith('men_')).map((cat) => (
                      <Picker.Item key={cat.value} label={cat.label.replace('Men: ', '')} value={cat.value} />
                    ))}
                    
                    <Picker.Item label="Women's Wear" value="header_women" enabled={false} />
                    {categories.filter(cat => cat.value.startsWith('women_')).map((cat) => (
                      <Picker.Item key={cat.value} label={cat.label.replace('Women: ', '')} value={cat.value} />
                    ))}
                    
                    <Picker.Item label="Unisex" value="header_unisex" enabled={false} />
                    {categories.filter(cat => cat.value.startsWith('unisex_')).map((cat) => (
                      <Picker.Item key={cat.value} label={cat.label.replace('Unisex: ', '')} value={cat.value} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Stitched/Unstitched */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stitched/Unstitched*</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={product.stitched}
                  onValueChange={(itemValue) => setProduct({ ...product, stitched: itemValue })}
                  style={styles.picker}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item label="Stitched" value="stitched" />
                  <Picker.Item label="Unstitched" value="unstitched" />
                </Picker>
              </View>
            </View>

            {/* Colors */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Colors*</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedColor}
                  onValueChange={setSelectedColor}
                  style={styles.picker}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item label="Select Color" value="" />
                  {colorOptions.map((color) => (
                    <Picker.Item key={color.value} label={color.label} value={color.value} />
                  ))}
                </Picker>
              </View>
              
              {selectedColor && (
                <TouchableOpacity 
                  style={styles.addItemButton} 
                  onPress={handleAddColor}
                >
                  <Text style={styles.addItemButtonText}>Add Color</Text>
                  <Ionicons name="add-circle" size={20} color={colors.white} />
                </TouchableOpacity>
              )}
              
              {product.colors.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                  <Text style={styles.selectedItemsLabel}>Selected Colors:</Text>
                  <View style={styles.selectedItems}>
                    {product.colors.map((color) => (
                      <View key={color} style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>
                          {colorOptions.find(c => c.value === color)?.label || color}
                        </Text>
                        <TouchableOpacity onPress={() => handleRemoveColor(color)}>
                          <Ionicons name="close-circle" size={18} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Sizes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sizes*</Text>
              {product.category ? (
                <>
                  <View style={styles.sizeOptionsContainer}>
                    {(sizeOptions[product.category] || ['Free Size']).map((size) => (
                      <TouchableOpacity
                        key={size}
                        style={[
                          styles.sizeOption,
                          selectedSizes.includes(size) && styles.sizeOptionSelected
                        ]}
                        onPress={() => handleSizeSelection(size)}
                      >
                        <Text 
                          style={[
                            styles.sizeOptionText,
                            selectedSizes.includes(size) && styles.sizeOptionTextSelected
                          ]}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {selectedSizes.length > 0 && (
                    <View style={styles.selectedItemsContainer}>
                      <Text style={styles.selectedItemsLabel}>Selected Sizes:</Text>
                      <View style={styles.selectedItems}>
                        {selectedSizes.map((size) => (
                          <View key={size} style={styles.selectedItem}>
                            <Text style={styles.selectedItemText}>{size}</Text>
                            <TouchableOpacity onPress={() => handleSizeSelection(size)}>
                              <Ionicons name="close-circle" size={18} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <Text style={styles.hintText}>Please select a category first</Text>
              )}
            </View>

            {/* Images */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Images ({product.images.length}/5)*</Text>
              
              {product.images.length > 0 && (
                <FlatList
                  horizontal
                  data={product.images}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item }} style={styles.imagePreview} />
                      <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={styles.imageList}
                />
              )}
              
              <TouchableOpacity 
                style={styles.imageUploadButton}
                onPress={showImagePickerOptions}
                disabled={uploading || product.images.length >= 5}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <Ionicons name="images" size={24} color={colors.primary} />
                    <Text style={styles.imageUploadText}>
                      {product.images.length >= 5 ? 'Maximum 5 images' : 'Add Product Images'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={styles.hintText}>You can add up to 5 images</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, (loading || uploading) && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={loading || uploading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Adding Product...' : 'Save Product'}
              </Text>
              {!loading && !uploading && <Ionicons name="checkmark-circle" size={24} color={colors.white} />}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop:50,
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
    paddingHorizontal: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
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
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addItemButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  addItemButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginRight: 8,
  },
  selectedItemsContainer: {
    marginTop: 10,
  },
  selectedItemsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    marginRight: 5,
    color: colors.text,
  },
  sizeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeOption: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  sizeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sizeOptionText: {
    color: colors.text,
  },
  sizeOptionTextSelected: {
    color: colors.white,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  imageList: {
    paddingBottom: 10,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
  },
  imageUploadText: {
    marginLeft: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
    fontStyle: 'italic',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default AddProductScreen;