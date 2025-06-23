import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const SupportScreen = () => {
  const supportOptions = [
    {
      id: '1',
      title: 'FAQs',
      description: 'Find answers to frequently asked questions',
      icon: 'help-circle',
      onPress: () => {}
    },
    {
      id: '2',
      title: 'Contact Us',
      description: 'Get in touch with our support team',
      icon: 'mail',
      onPress: () => {}
    },
    {
      id: '3',
      title: 'Track Order',
      description: 'Track your order status and delivery',
      icon: 'cube',
      onPress: () => {}
    },
    {
      id: '4',
      title: 'Return Policy',
      description: 'Learn about our return and refund policy',
      icon: 'refresh',
      onPress: () => {}
    },
    {
      id: '5',
      title: 'Privacy Policy',
      description: 'Read our privacy policy and terms of service',
      icon: 'shield-checkmark',
      onPress: () => {}
    }
  ];

  const renderSupportOption = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.supportCard}
      onPress={item.onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.supportContent}>
        <Text style={styles.supportTitle}>{item.title}</Text>
        <Text style={styles.supportDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <Ionicons name="call" size={24} color={colors.primary} />
            <Text style={styles.contactTitle}>Need immediate assistance?</Text>
          </View>
          <Text style={styles.contactDescription}>
            Our customer support team is available 24/7 to help you with any questions or concerns.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          {supportOptions.map(renderSupportOption)}
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Common Questions</Text>
          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>How do I track my order?</Text>
            <Text style={styles.faqAnswer}>
              You can track your order by going to My Orders section and clicking on the order you want to track.
            </Text>
          </View>
          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>What is your return policy?</Text>
            <Text style={styles.faqAnswer}>
              We offer a 7-day return policy for all items. Items must be unused and in original packaging.
            </Text>
          </View>
        </View>
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
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  faqSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});

export default SupportScreen; 