import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { API_URL } from '../../../env'; // Import API_URL
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomer } from '../../context/CustomerContext';
import SuccessModal from '../../components/SuccessModal';

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const userType = route.params?.userType || 'customer';
  const { login: customerLogin } = useCustomer();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [postLoginAction, setPostLoginAction] = useState(null);

  const handleModalClose = () => {
    setModalVisible(false);
    if (postLoginAction) {
      postLoginAction();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (userType === 'customer') {
      const result = await customerLogin(email, password);
      if (result.success) {
        setModalMessage('Login Successful!');
        setPostLoginAction(() => () => navigation.replace('CustomerStack', { screen: 'Dashboard' }));
        setModalVisible(true);
      } else {
        Alert.alert('Error', result.message || 'Login failed.');
      }
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${userType}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        let userIdKey = 'userId';
        let userIdValue;
        let userName = '';

        switch (userType) {
          case 'rider':
            userIdValue = data.riderId;
            userName = data.name; 
            await AsyncStorage.setItem('riderName', userName);
            break;
          case 'brand':
            userIdValue = data.brandId;
            userName = data.name;
            await AsyncStorage.setItem('brandName', userName);
            break;
        }

        if (userIdValue) {
          await AsyncStorage.setItem(userIdKey, userIdValue);
        }
        
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }

        setModalMessage(data.message);
        setPostLoginAction(() => () => {
          if (userType === 'rider') {
            navigation.replace('RiderStack');
          } else if (userType === 'brand') {
            navigation.replace('BrandStack', { brandName: userName });
          }
        });
        setModalVisible(true);
      } else {
        Alert.alert('Error', data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup', { userType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top Yellow Section with Icon */}
          <View style={styles.topSection}>
            <Ionicons name="basket-outline" size={80} color={colors.white} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.white} style={styles.arrowIcon} />
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessModal
        visible={modalVisible}
        onClose={handleModalClose}
        message={modalMessage}
      />
    </SafeAreaView>
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
  },
  topSection: {
    backgroundColor: colors.primary,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: -50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    marginLeft: 5,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.text,
    borderWidth: 0,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 