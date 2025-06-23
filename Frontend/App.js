import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import colors from './src/theme/colors';
import BrandDrawerContent from './src/navigation/BrandDrawerContent';
import CustomerDrawerContent from './src/navigation/CustomerDrawerContent';
import RiderDrawerContent from './src/navigation/RiderDrawerContent';
import { CustomerProvider } from './src/context/CustomerContext';

// Common Screens
import SplashScreen from './src/screens/common/SplashScreen';
import RoleSelectionScreen from './src/screens/common/RoleSelectionScreen';
import WelcomeScreen from './src/screens/common/WelcomeScreen';
import LoginScreen from './src/screens/common/LoginScreen';
import SignupScreen from './src/screens/common/SignupScreen';
import OtpScreen from './src/screens/common/OtpScreen';

// Customer Screens
import HomeScreen from './src/screens/customer/HomeScreen';
import ProfileScreen from './src/screens/customer/ProfileScreen';
import OrdersScreen from './src/screens/customer/OrdersScreen';
import DashboardScreen from './src/screens/customer/DashboardScreen';
import BrandProductsScreen from './src/screens/customer/BrandProductsScreen';
import ProductDetailScreen from './src/screens/customer/ProductDetailScreen';
import CheckoutScreen from './src/screens/customer/CheckoutScreen';

// Rider Screens
import RiderHome from './src/screens/rider/HomeScreen';
import RiderProfile from './src/screens/rider/ProfileScreen';
import RiderOrders from './src/screens/rider/OrdersScreen';
import RiderDashboard from './src/screens/rider/DashboardScreen';

// Brand Screens
import BrandProfileScreen from './src/screens/brand/BrandProfileScreen';
import BrandOrdersScreen from './src/screens/brand/BrandOrdersScreen';
import BrandDashboardScreen from './src/screens/brand/BrandDashboardScreen';
import ProductsScreen from './src/screens/brand/ProductsScreen';
import StoreScreen from './src/screens/brand/StoreScreen';
import ProductDetailsScreen from './src/screens/brand/ProductDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Brand Stack Navigator (for screens that should be in a stack within the Brand flow)
function BrandStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide header for screens in this stack by default
      }}
    >
      <Stack.Screen name="BrandDashboard" component={BrandDashboardScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="BrandProfile" component={BrandProfileScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}

// Brand Drawer Navigator (replaces the BrandTabNavigator)
function BrandDrawerNavigator({ route }) {
  console.log('BrandDrawerNavigator: Received route.params:', route.params);
  const { brandName } = route.params || {};
  console.log('BrandDrawerNavigator: Extracted brandName:', brandName);

  return (
    <Drawer.Navigator
      drawerContent={props => <BrandDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 16,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={BrandDashboardScreen}
        initialParams={{ brandName: brandName }}
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="StoreDrawer"
        component={BrandStackScreen}
        options={{
          title: 'My Store',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProductsDrawer"
        component={ProductsScreen}
        options={{
          title: 'Products',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="OrdersDrawer"
        component={BrandOrdersScreen}
        options={{
          title: 'Orders',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileDrawer"
        component={BrandProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Customer Stack Navigator
function CustomerStackScreen() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomerDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 16,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Non-drawer screens */}
      <Drawer.Screen name="BrandProducts" component={BrandProductsScreen} options={{
        drawerItemStyle: { height: 0 }
      }}/>
      <Drawer.Screen name="ProductDetail" component={ProductDetailScreen} options={{
        drawerItemStyle: { height: 0 }
      }}/>
      <Drawer.Screen name="Checkout" component={CheckoutScreen} options={{
        drawerItemStyle: { height: 0 }
      }}/>
    </Drawer.Navigator>
  );
}

// Rider Drawer Navigator
function RiderDrawerNavigator({ route }) {
  const { riderName } = route.params || {};
  return (
    <Drawer.Navigator
      drawerContent={(props) => <RiderDrawerContent {...props} riderName={riderName} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 16,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={RiderHome}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={RiderOrders}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={RiderProfile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Customer Tab Navigator
const CustomerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Orders"
      component={OrdersScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="list-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Rider Tab Navigator - This is no longer directly used in the main stack but can be kept for other purposes if needed.
const RiderTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={RiderHome}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Orders"
      component={RiderOrders}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="list-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={RiderProfile}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomerProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName="Splash" 
            screenOptions={{ 
              headerShown: false,
              gestureEnabled: false
            }}
          >
            {/* Initial Screens */}
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

            {/* Common Screens */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />

            {/* Role-specific Stacks */}
            <Stack.Screen name="CustomerStack" component={CustomerStackScreen} />
            <Stack.Screen name="RiderStack" component={RiderDrawerNavigator} />
            <Stack.Screen name="BrandStack" component={BrandDrawerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </CustomerProvider>
    </GestureHandlerRootView>
  );
} 