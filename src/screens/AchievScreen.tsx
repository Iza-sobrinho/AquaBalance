import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
}

const achievementsData: Achievement[] = [
  { id: '1', title: 'Conquista 1', description: 'Descrição da conquista 1', achieved: false },
  { id: '2', title: 'Conquista 2', description: 'Descrição da conquista 2', achieved: false },
  { id: '3', title: 'Conquista 3', description: 'Descrição da conquista 3', achieved: false },
  { id: '4', title: 'Conquista 4', description: 'Descrição da conquista 4', achieved: false },
  { id: '5', title: 'Conquista 5', description: 'Descrição da conquista 5', achieved: false },
];

const saveAchievement = async (achievement: Achievement) => {
  try {
    await firestore().collection('achievements').add(achievement);
    console.log('Conquista salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar a conquista: ', error);
  }
};

const fetchAchievements = async () => {
  try {
    const snapshot = await firestore().collection('achievements').get();
    const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(achievements);
  } catch (error) {
    console.error('Erro ao buscar conquistas: ', error);
  }
};

const AchievementsScreen: React.FC = () => {
  const [achievements, setAchievements] = useState(achievementsData);

  const toggleAchievement = (id: string) => {
    setAchievements((prevAchievements) =>
      prevAchievements.map((achievement) =>
        achievement.id === id
          ? { ...achievement, achieved: !achievement.achieved }
          : achievement
      )
    );
  };

  const renderItem = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementItem}>
      <Image
        source={require('../../assets/MedalhaAzul.png')}
        style={[
          styles.achievementIcon,
          { tintColor: item.achieved ? '#1E88E5' : '#A9A9A9' } // Azul quando conquistado, cinza quando não
        ]}
      />
      <View style={styles.achievementTextContainer}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleAchievement(item.id)}>
        <Text style={styles.moreOptions}>...</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Minhas Conquistas</Text>
      </View>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  headerContainer: {
    backgroundColor: '#0D47A1',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
  },
  moreOptions: {
    fontSize: 20,
    color: '#333333',
  },
});

export default AchievementsScreen;
