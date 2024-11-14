import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import MonitorScreen from './src/screens/MonitorScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  Monitor: undefined;
  UserProfile: undefined;
  History: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  const [isUserProfileComplete, setIsUserProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      const userProfile = await AsyncStorage.getItem('@user_profile');
      setIsUserProfileComplete(!!userProfile);
    };
    checkUserProfile();
  }, []);

  if (isUserProfileComplete === null) {
    return null; 
  }

  return (
    <NavigationContainer>
      {isUserProfileComplete ? (
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: () => (
              <Image source={require('./assets/pingo-dagua.png')} style={{ width: 24, height: 24 }} />
            ),
          }}
        />
          <Tab.Screen name="Monitor" component={MonitorScreen}
          options={{
            tabBarIcon: () => (
              <Image source={require('./assets/icons8-classificação-48.png')} style={{ width: 24, height: 24 }} />
            ),
          }} 
          />
          <Tab.Screen name="History" component={HistoryScreen} 
          options={{
            tabBarIcon: () => (
              <Image source={require('./assets/relogio (1).png')} style={{ width: 24, height: 24 }} />
            ),
          }}
          />
          <Tab.Screen name="Settings" component={SettingsScreen} 
          options={{
            tabBarIcon: () => (
              <Image source={require('./assets/icons8-engrenagem-30.png')} style={{ width: 24, height: 24 }} />
            ),
          }}/>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="UserProfile">
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Monitor" component={MonitorScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
