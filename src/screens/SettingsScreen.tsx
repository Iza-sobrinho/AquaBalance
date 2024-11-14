import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const resetUserProfile = async () => {
    try {
      await AsyncStorage.removeItem('@user_profile'); // Remove o perfil do usuário do AsyncStorage
      Alert.alert('Perfil Reiniciado', 'O perfil de usuário foi reiniciado com sucesso.');
      navigation.navigate('UserProfile'); // Navega para a tela de perfil do usuário
    } catch (error) {
      console.error('Erro ao reiniciar o perfil de usuário:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Reiniciar Perfil de Usuário" onPress={resetUserProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default SettingsScreen;
