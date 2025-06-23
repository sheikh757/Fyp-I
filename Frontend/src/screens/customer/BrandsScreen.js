import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const BrandsScreen = ({ navigation, route }) => {
  const category = route.params?.category || 'women'; // Default to women's brands

  const brands = {
    women: [
      { id: '1', name: 'Khadi', logo: 'https://example.com/khadi-logo.png', description: 'Traditional Pakistani Fashion' },
      { id: '2', name: 'Sapphire', logo: 'https://example.com/sapphire-logo.png', description: 'Contemporary Fashion' },
      { id: '3', name: 'LimeLight', logo: 'https://example.com/limelight-logo.png', description: 'Modern Pakistani Wear' },
      { id: '4', name: 'Khaadi', logo: 'https://example.com/khaadi-logo.png', description: 'Premium Fashion' },
      { id: '5', name: 'GulAhmed', logo: 'https://example.com/gulahmed-logo.png', description: 'Traditional & Modern' },
      { id: '6', name: 'Alkaram', logo: 'https://example.com/alkaram-logo.png', description: 'Luxury Fashion' },
    ],
    men: [
      { id: '7', name: 'Bonanza', logo: 'https://example.com/bonanza-logo.png', description: 'Men\'s Fashion' },
      { id: '8', name: 'J.', logo: 'https://example.com/j-logo.png', description: 'Premium Men\'s Wear' },
      { id: '9', name: 'Breakout', logo: 'https://example.com/breakout-logo.png', description: 'Casual Wear' },
    ],
    kids: [
      { id: '10', name: 'Minimania', logo: 'https://example.com/minimania-logo.png', description: 'Kids Fashion' },
      { id: '11', name: 'Chinyere', logo: 'https://example.com/chinyere-logo.png', description: 'Children\'s Wear' },
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)}'s Brands
        </Text>
      </View>

      <View style={styles.content}>
        {brands[category].map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.brandCard}
            onPress={() => navigation.navigate('BrandProducts', { brand, category })}
          >
            <View style={styles.brandInfo}>
              <Text style={styles.brandName}>{brand.name}</Text>
              <Text style={styles.brandDescription}>{brand.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        ))}
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
    justifyContent: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  brandCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  brandDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default BrandsScreen; 