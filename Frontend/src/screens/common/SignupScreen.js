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

const SignupScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    capital: false,
    number: false,
    special: false,
  });
  const [showPasswordHelper, setShowPasswordHelper] = useState(false);
  const userType = route.params?.userType || 'customer';

  const validatePassword = (pass) => {
    const newRequirements = {
      length: pass.length >= 8,
      capital: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    setPasswordRequirements(newRequirements);

    return !Object.values(newRequirements).every(Boolean);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
  };

  const handleSignup = async () => {
    // Hide password helper text during signup attempt
    setShowPasswordHelper(false);

    // Validate all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Validate name format
    if (!validateName(name)) {
      Alert.alert('Error', 'Name can only contain alphabets and spaces.');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Validate password requirements
    if (validatePassword(password)) { // validatePassword now returns true if there are unmet requirements
      Alert.alert('Error', 'Password does not meet all requirements.');
      setShowPasswordHelper(true); // Show helper text again on error
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${userType}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          data.message,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Navigating to OtpScreen with expiresAt:', data.verificationCodeExpires);
                navigation.navigate('Otp', { userType, userId: data.userId, expiresAt: data.verificationCodeExpires });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', data.message || 'Something went wrong during signup.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login', { userType });
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
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create an account for {userType}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

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
                  onChangeText={(text) => {
                    setPassword(text);
                    validatePassword(text);
                    setShowPasswordHelper(true);
                  }}
                  secureTextEntry={!showPassword}
                  onFocus={() => setShowPasswordHelper(true)}
                  onBlur={() => setShowPasswordHelper(false)}
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
              {showPasswordHelper && (
                <View>
                  {!passwordRequirements.length && (
                    <Text style={styles.errorText}>- At least 8 characters long</Text>
                  )}
                  {!passwordRequirements.capital && (
                    <Text style={styles.errorText}>- At least one capital letter</Text>
                  )}
                  {!passwordRequirements.number && (
                    <Text style={styles.errorText}>- At least one number</Text>
                  )}
                  {!passwordRequirements.special && (
                    <Text style={styles.errorText}>- At least one special character</Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.sendOtpButton} onPress={handleSignup}>
              <Text style={styles.sendOtpButtonText}>Send OTP</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.white} style={styles.arrowIcon} />
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  sendOtpButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  sendOtpButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default SignupScreen; 