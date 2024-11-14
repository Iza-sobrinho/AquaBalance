import { View, Text, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';


const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [dailyWaterIntake, setDailyWaterIntake] = useState<number | null>(null);
  const [currentIntake, setCurrentIntake] = useState<number>(0);
  const [weight, setWeight] = useState<number | null>(null);
  const [waterAmount, setWaterAmount] = useState<number>(100);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await AsyncStorage.getItem('@user_profile');
      if (userProfile) {
        const { weight } = JSON.parse(userProfile);
        setWeight(weight);
        const waterIntake = weight ? 35 * weight : 0;
        setDailyWaterIntake(waterIntake);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      const storedIntake = await AsyncStorage.getItem('@total_intake');
      if (storedIntake) {
        setCurrentIntake(parseInt(storedIntake));
      }
    };
    fetchProgress();
  }, []);

  const saveDailyIntake = async () => {
    try {
      const currentDate = new Date().toLocaleDateString();
      const newLog = { date: currentDate, totalIntake: currentIntake };
      const storedLogs = await AsyncStorage.getItem('@water_logs');
      const parsedLogs = storedLogs ? JSON.parse(storedLogs) : [];
      parsedLogs.push(newLog);
      await AsyncStorage.setItem('@water_logs', JSON.stringify(parsedLogs));
      Alert.alert('Sucesso', 'Consumo diário registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar registro de consumo diário:', error);
    }
  };

  const increaseWaterAmount = () => {
    setWaterAmount((prev) => Math.min(prev + 100, 1000)); // Limite máximo de 1000 ml
  };

  const decreaseWaterAmount = () => {
    setWaterAmount((prev) => Math.max(prev - 100, 100)); // Limite mínimo de 100 ml
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com o logo e saudação */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bem-Vindo!</Text>
        <Text style={styles.username}>Usuário</Text>
      </View>

      {/* Ícone de gota de água */}
      <Image source={require('../../assets/pingo-dagua.png')} style={styles.waterIcon} />

      {/* Barra de controle de consumo */}
      <View style={styles.waterControl}>
        <TouchableOpacity style={styles.decreaseButton} onPress={decreaseWaterAmount}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.amountText}>{waterAmount} ml</Text>
        <TouchableOpacity style={styles.increaseButton} onPress={increaseWaterAmount}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveDailyIntake}>
        <Text style={styles.saveButtonText}>Salvar Consumo</Text>
      </TouchableOpacity>

      {/* Blocos de Dicas, Conquistas e Monitor */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}><Text style={styles.infoText}>Dicas</Text></View>
        <View style={styles.infoBox}><Text style={styles.infoText}>Conquistas</Text></View>
      </View>
      <View style={styles.infoBoxLarge}><Text style={styles.infoText}>Monitor</Text></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA', 
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#0D47A1',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  waterIcon: {
    alignSelf: 'center',
    width: 100,
    height: 150,
    marginVertical: 20,
  },
  waterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  decreaseButton: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 20,
  },
  increaseButton: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 20,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  slider: {
    width: '60%',
    height: 5,
    backgroundColor: '#B3E5FC',
    marginHorizontal: 10,
    borderRadius: 2.5,
  },
  saveButton: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  infoBox: {
    width: '45%',
    backgroundColor: '#BBDEFB',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#1E88E5',
  },
  infoBoxLarge: {
    backgroundColor: '#BBDEFB',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;