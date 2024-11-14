import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

interface Entry {
  id: string;
  date: string; // Usando string para datas, pois Date não é serializável
  amount: number;
}

const saveEntry = async (entry: Entry) => {
  try {
    await firestore().collection('entries').add(entry);
    console.log('Entrada salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar a entrada: ', error);
  }
};

const HistoryScreen: React.FC = () => {
  const [waterLogs, setWaterLogs] = useState<Entry[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [intakes, setIntakes] = useState<number[]>([]);

  useEffect(() => {
    const fetchWaterLogs = async () => {
      const storedLogs = await AsyncStorage.getItem('@water_logs');
      if (storedLogs) {
        const parsedLogs: Entry[] = JSON.parse(storedLogs);
        setWaterLogs(parsedLogs);

        // Extrair datas e consumos
        const formattedDates = parsedLogs.map((log) => log.date);
        const formattedIntakes = parsedLogs.map((log) => log.amount);
        setDates(formattedDates);
        setIntakes(formattedIntakes);
      }
    };

    fetchWaterLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Consumo de Água</Text>
      {intakes.length > 0 ? (
        <LineChart
          data={{
            labels: dates,
            datasets: [
              {
                data: intakes,
              },
            ],
          }}
          width={340}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#000000',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text style={styles.loading}>Carregando dados...</Text>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loading: {
    fontSize: 18,
    color: '#888',
  },
});

export default HistoryScreen;
