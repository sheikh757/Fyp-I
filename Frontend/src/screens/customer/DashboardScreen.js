import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function CustomerDashboardScreen({ navigation }) {
  const categories = [
    {
      id: 'women',
      title: "Women's Fashion",
      description: 'Discover top brands for women',
      icon: 'woman',
    },
    {
      id: 'men',
      title: "Men's Fashion",
      description: 'Explore men\'s fashion brands',
      icon: 'man',
    },
    {
      id: 'kids',
      title: "Kids' Fashion",
      description: 'Find the best brands for kids',
      icon: 'people',
    },
  ];

  const recentOrders = [
    { id: 1, brand: 'Nike', status: 'Delivered', date: '2024-03-15', items: '2 T-shirts, 1 Jeans' },
    { id: 2, brand: 'Zara', status: 'In Transit', date: '2024-03-14', items: '1 Dress, 1 Jacket' },
  ];

  const featuredBrands = [
    { name: 'Khadi', image: 'https://example.com/khadi.png', rating: 4.8 },
    { name: 'Sapphire', image: 'https://example.com/sapphire.png', rating: 4.6 },
    { name: 'LimeLight', image: 'https://example.com/limelight.png', rating: 4.5 },
    { name: 'Khaadi', image: 'https://example.com/khaadi.png', rating: 4.7 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hello, John</Text>
            <Text style={styles.subGreeting}>Find your favorite fashion brands</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={40} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <Text style={styles.searchText}>Search for brands and clothing items</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Brands', { category: category.id })}
          >
            <View style={styles.categoryInfo}>
              <Ionicons name={category.icon} size={32} color={colors.primary} />
              <View style={styles.categoryText}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Brands */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Fashion Brands</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsContainer}>
          {featuredBrands.map((brand, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.brandCard}
              onPress={() => navigation.navigate('BrandProducts', { brand })}
            >
              <View style={styles.brandLogo}>
                <Text style={styles.brandInitial}>{brand.name[0]}</Text>
              </View>
              <Text style={styles.brandName}>{brand.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{brand.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentOrders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.brandName}>{order.brand}</Text>
              <Text style={styles.orderItems}>{order.items}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={styles.orderStatus}>
              <Text style={[
                styles.statusText,
                { color: order.status === 'Delivered' ? '#4CAF50' : '#2196F3' }
              ]}>
                {order.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fast Delivery Banner */}
      <View style={styles.deliveryBanner}>
        <Ionicons name="flash" size={24} color="#fff" />
        <Text style={styles.deliveryText}>Fast Delivery Available</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 15,
    padding: 5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  profileButton: {
    padding: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  searchText: {
    marginLeft: 10,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryText: {
    marginLeft: 15,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
  },
  brandsContainer: {
    marginTop: 10,
  },
  brandCard: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  brandLogo: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandInitial: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    color: '#666',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderItems: {
    color: '#666',
    marginTop: 5,
  },
  orderDate: {
    color: '#666',
    marginTop: 5,
    fontSize: 12,
  },
  orderStatus: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryBanner: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  deliveryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 