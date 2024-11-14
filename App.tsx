import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';

import HomeScreen from './src/screens/HomeScreen';
import AchievScreen from './src/screens/AchievScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type RootStackParamList = {
  Home: undefined;
  Conquistas: undefined;
  UserProfile: undefined;
  Histórico: undefined;
  Configurações: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isUserProfileComplete, setIsUserProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const userProfile = await AsyncStorage.getItem('@user_profile');
        setIsUserProfileComplete(userProfile === 'complete');
      } catch (error) {
        console.error('Erro ao carregar o perfil do usuário:', error);
      }
    };
    checkUserProfile();
  }, []);

  const handleUserProfileComplete = async () => {
    try {
      await AsyncStorage.setItem('@user_profile', 'complete');
      setIsUserProfileComplete(true);
    } catch (error) {
      console.error('Erro ao salvar o perfil do usuário:', error);
    }
  };

  if (isUserProfileComplete === null) {
    return null; // Uma tela de carregamento pode ser exibida aqui
  }

  const TabNavigator = () => (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: '#0D47A1',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('./assets/pingo-dagua.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Conquistas"
        component={AchievScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('./assets/icons8-classificação-48.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Histórico"
        component={HistoryScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('./assets/relogio(1).png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Configurações"
        component={SettingsScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('./assets/icons8-engrenagem-30.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      {isUserProfileComplete ? (
        <TabNavigator />
      ) : (
        <Stack.Navigator initialRouteName="UserProfile">
          <Stack.Screen name="UserProfile">
            {(props) => <UserProfileScreen {...props} onComplete={handleUserProfileComplete} />}
          </Stack.Screen>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Conquistas" component={AchievScreen} />
          <Stack.Screen name="Histórico" component={HistoryScreen} />
          <Stack.Screen name="Configurações" component={SettingsScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
