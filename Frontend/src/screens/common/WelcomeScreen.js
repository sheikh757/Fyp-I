import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const WelcomeScreen = ({ navigation, route }) => {
  const userType = route.params?.userType || 'customer';

  const getWelcomeMessage = () => {
    switch (userType) {
      case 'customer':
        return 'Shop your favorite fashion brands';
      case 'rider':
        return 'Deliver fashion to customers';
      case 'brand':
        return 'Manage your fashion brand';
      default:
        return 'Welcome to FashionDelivery';
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login', { userType });
  };

  const handleSignup = () => {
    navigation.navigate('Signup', { userType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to FlashFit</Text>
          <Text style={styles.subtitle}>
            {getWelcomeMessage()}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/flash.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSignup}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '60%',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
});

export default WelcomeScreen; 