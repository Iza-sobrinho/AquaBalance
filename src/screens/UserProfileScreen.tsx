import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

interface UserProfileScreenProps {
  onComplete: () => void;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');

  const saveUserProfile = async () => {
    if (!name || !age || !weight || !gender) {
      Alert.alert('Por favor, preencha todos os campos.');
      return;
    }

    const userProfile = {
      name,
      age,
      weight,
      gender,
    };

    await AsyncStorage.setItem('@user_profile', JSON.stringify(userProfile));
    onComplete(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações do Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <Text style={styles.label}>Gênero:</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Selecione seu gênero" value="" />
        <Picker.Item label="Masculino" value="masculino" />
        <Picker.Item label="Feminino" value="feminino" />
      </Picker>
      <Button title="Salvar" onPress={saveUserProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    marginTop: 20,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default UserProfileScreen;
