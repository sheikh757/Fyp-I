import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import axios from 'axios';
import { API_URL } from '../../../env';
import { useIsFocused } from '@react-navigation/native';
import useBackHandler from '../../hooks/useBackHandler';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  useBackHandler(isFocused);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands(brands);
    }
  }, [searchQuery, brands]);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/brand/all`);
      if (response.data.success) {
        setBrands(response.data.data);
        setFilteredBrands(response.data.data);
      } else {
        setError('Failed to fetch brands');
      }
    } catch (err) {
      setError('Failed to fetch brands');
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBrands}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FlashFit</Text>
        <View style={{width: 24}}/>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for brands..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Brands</Text>
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <TouchableOpacity
              key={brand._id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('BrandProducts', { brandId: brand._id, brandName: brand.name })}
            >
              <View style={styles.categoryInfo}>
                <Ionicons name="business" size={32} color={colors.primary} />
                <View style={styles.categoryText}>
                  <Text style={styles.categoryTitle}>{brand.name}</Text>
                  <Text style={styles.categoryDescription}>{brand.email}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No brands found matching your search.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 20,
    paddingHorizontal: 15,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
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
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textSecondary,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen; 