import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../theme';
import { useAuthStore } from '../store/authStore';

import {
  LandingScreen,
  LoginScreen,
  DashboardScreen,
  InvoiceUploadScreen,
  GSTR2BScreen,
  ITCDashboardScreen,
  TasksScreen,
  VoiceScreen,
  SupplierScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: '🏠',
  Invoice: '📄',
  GSTR2B: '📊',
  Tasks: '✅',
  Voice: '🎙',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: () => null,
      tabBarLabel: ({
        Home: 'होम',
        Invoice: 'Invoice',
        GSTR2B: 'GSTR-2B',
        Tasks: 'Tasks',
        Voice: 'Voice',
      }[route.name]),
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.divider,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Invoice" component={InvoiceUploadScreen} />
    <Tab.Screen name="GSTR2B" component={GSTR2BScreen} />
    <Tab.Screen name="Tasks" component={TasksScreen} />
    <Tab.Screen name="Voice" component={VoiceScreen} />
  </Tab.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="ITCDashboard" component={ITCDashboardScreen} />
    <Stack.Screen name="Suppliers" component={SupplierScreen} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user, loading, initialize } = useAuthStore();

  useEffect(() => { initialize(); }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};
