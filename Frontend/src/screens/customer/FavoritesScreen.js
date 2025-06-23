import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const FavoritesScreen = () => {
  // Sample favorites data
  const favorites = [
    {
      id: '1',
      name: 'Floral Print Lawn Suit',
      brand: 'Khadi',
      price: 2500,
      category: 'Women\'s Fashion'
    },
    {
      id: '2',
      name: 'Men\'s Casual Shirt',
      brand: 'Bonanza',
      price: 1750,
      category: 'Men\'s Fashion'
    },
    {
      id: '3',
      name: 'Kids Party Dress',
      brand: 'Minimania',
      price: 1200,
      category: 'Kids\' Fashion'
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Women\'s Fashion':
        return 'woman';
      case 'Men\'s Fashion':
        return 'man';
      case 'Kids\' Fashion':
        return 'people';
      default:
        return 'shirt';
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity style={styles.favoriteCard}>
      <View style={styles.imageContainer}>
        <Ionicons 
          name={getCategoryIcon(item.category)} 
          size={60} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.brandName}>{item.brand}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Rs. {item.price}</Text>
          <TouchableOpacity style={styles.removeButton}>
            <Ionicons name="heart" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 16,
  },
  brandName: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  removeButton: {
    padding: 8,
  },
});

export default FavoritesScreen; 