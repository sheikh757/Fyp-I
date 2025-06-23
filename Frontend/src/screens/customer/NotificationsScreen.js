import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const NotificationsScreen = () => {
  // Sample notifications data
  const notifications = [
    {
      id: '1',
      title: 'Order Delivered',
      message: 'Your order #ORD-2024-001 has been delivered successfully.',
      time: '2 hours ago',
      type: 'order',
      read: false
    },
    {
      id: '2',
      title: 'New Collection',
      message: 'Khadi has launched their new summer collection. Check it out!',
      time: '1 day ago',
      type: 'promotion',
      read: true
    },
    {
      id: '3',
      title: 'Price Drop Alert',
      message: 'The price of your favorite item has dropped by 20%.',
      time: '2 days ago',
      type: 'price',
      read: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return 'cube';
      case 'promotion':
        return 'megaphone';
      case 'price':
        return 'pricetag';
      default:
        return 'notifications';
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={[
      styles.notificationCard,
      !item.read && styles.unreadCard
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
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
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadCard: {
    backgroundColor: '#f0f7ff',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});

export default NotificationsScreen; 