import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../env';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCustomerAuth();
  }, []);

  const checkCustomerAuth = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        // Fetch customer details
        const response = await fetch(`${API_URL}/customer/profile/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setCustomer(data);
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store both userId and token
        await AsyncStorage.setItem('userId', data.customerId);
        await AsyncStorage.setItem('token', data.token);
        setCustomer(data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      // Remove both userId and token
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('token');
      setCustomer(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <CustomerContext.Provider value={{ customer, loading, login, logout }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}; 