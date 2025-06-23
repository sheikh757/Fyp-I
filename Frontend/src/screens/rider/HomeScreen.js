import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import useBackHandler from '../../hooks/useBackHandler';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  useBackHandler(isFocused);
  const [isOnline, setIsOnline] = useState(false);

  const riderDetails = {
    name: 'Ali Khan',
    vehicle: 'Honda CD 70',
    plate: 'KHI-1234',
  };

  const currentTask = {
    id: 'ORD-5678',
    pickup: 'Khaadi, Dolmen Mall',
    dropoff: 'House #123, Block 5, Clifton',
    status: 'Pending Pickup',
  };

  const stats = {
    deliveries: 5,
    earnings: 'PKR 2,500',
    rating: 4.8,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Dashboard</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusTitle}>Your Status</Text>
            <Text style={[styles.statusText, { color: isOnline ? colors.success : colors.error }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Your Details</Text>
          <Text style={styles.detailText}><Ionicons name="person-outline" size={16} /> {riderDetails.name}</Text>
          <Text style={styles.detailText}><Ionicons name="bicycle-outline" size={16} /> {riderDetails.vehicle}</Text>
          <Text style={styles.detailText}><Ionicons name="reader-outline" size={16} /> {riderDetails.plate}</Text>
        </View>

        <View style={styles.taskCard}>
          <Text style={styles.cardTitle}>Current Task</Text>
          {currentTask ? (
            <>
              <Text style={styles.taskLabel}>Pickup:</Text>
              <Text style={styles.taskText}>{currentTask.pickup}</Text>
              <Text style={styles.taskLabel}>Drop-off:</Text>
              <Text style={styles.taskText}>{currentTask.dropoff}</Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Order Details</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noTaskText}>No active tasks. Go online to receive orders.</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.deliveries}</Text>
                <Text style={styles.statLabel}>Today's Deliveries</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.earnings}</Text>
                <Text style={styles.statLabel}>Today's Earnings</Text>
            </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
    },
    content: {
        padding: 15,
    },
    statusCard: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    statusText: {
        fontSize: 16,
        marginTop: 5,
    },
    detailsCard: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
    },
    detailText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 8,
        lineHeight: 24,
    },
    taskCard: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
    },
    taskLabel: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 4,
    },
    taskText: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 12,
    },
    noTaskText: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: 'center',
    },
    detailsButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    detailsButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    statItem: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '48%',
        elevation: 2,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 5,
    },
    menuButton: {
        padding: 5,
    },
});

export default HomeScreen; 