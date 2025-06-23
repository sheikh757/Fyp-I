import React, { useState, useEffect } from 'react';
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

const OtpScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const userType = route.params?.userType || 'customer';
  const userId = route.params?.userId; // Get userId from route params
  const initialExpiresAt = route.params?.expiresAt; // Get initial expiration timestamp

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    console.log('OtpScreen mounted/initialExpiresAt changed. initialExpiresAt:', initialExpiresAt); // Log initial expiresAt
    if (initialExpiresAt) {
      const expiryDate = new Date(initialExpiresAt);
      const interval = setInterval(() => {
        const now = new Date();
        const difference = expiryDate.getTime() - now.getTime();

        if (difference <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          setTimerExpired(true);
        } else {
          setTimeLeft(Math.floor(difference / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [initialExpiresAt]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP.');
      return;
    }
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please try signing up again.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${userType}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
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
                // Navigate to RoleSelectionScreen after successful OTP verification
                navigation.replace('RoleSelection');
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', data.message || 'OTP verification failed.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  const handleResendOtp = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found for resend. Please try signing up again.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${userType}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message || 'New OTP sent successfully!');
        // Update the timer with the new expiry time
        if (data.verificationCodeExpires) {
          console.log('OTP resent successfully. New verificationCodeExpires:', data.verificationCodeExpires); // Log new expiresAt after resend
          setTimeLeft(Math.floor((new Date(data.verificationCodeExpires).getTime() - new Date().getTime()) / 1000));
          setTimerExpired(false);
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top Section with Icon */}
          <View style={styles.topSection}>
            <Ionicons name="lock-closed-outline" size={80} color={colors.white} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  textAlign="center"
                />
              </View>
            </View>

            {timeLeft > 0 && (
              <Text style={styles.timerText}>Code expires in: {formatTime(timeLeft)}</Text>
            )}
            {timerExpired && (
              <Text style={styles.timerExpiredText}>OTP Expired! Please resend.</Text>
            )}

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp} disabled={timerExpired}>
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.white} style={styles.arrowIcon} />
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <TouchableOpacity onPress={handleResendOtp} disabled={!timerExpired}>
                <Text style={styles.resendLink}>Resend OTP</Text>
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
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  timerExpiredText: {
    fontSize: 14,
    color: colors.error, // Assuming you have an error color in your theme
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OtpScreen; 