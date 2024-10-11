import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { getCharacterInfo } from './component/lostArkApi';
import EquipmentSection from './component/equipment/equipmentSection';
import { groupEquipmentByType } from './component/equipment/groupEquipmentByType';

const App = () => {
  const [characterName, setCharacterName] = useState('');
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCharacter = async () => {
    if (!characterName.trim()) {
      setError('캐릭터 이름을 입력하세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setCharacterData(null);

    try {
      const data = await getCharacterInfo(characterName.trim());
      setCharacterData(data);
    } catch (err) {
      console.error(err);
      setError('캐릭터를 찾을 수 없습니다. 이름을 다시 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="캐릭터 이름"
          value={characterName}
          onChangeText={setCharacterName}
        />
        <Button title="검색" onPress={searchCharacter} />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {characterData && <CharacterDetails data={characterData} />}
    </SafeAreaView>
  );
};

const CharacterDetails = ({ data }) => {
  const {
    ArmoryProfile,
    ArmoryEquipment,
  } = data;

  const groupedEquipment = groupEquipmentByType(ArmoryEquipment);
  const imageUrl = `${ArmoryProfile.CharacterImage}`;

  return (
    <ScrollView style={styles.resultContainer}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.characterImage}
        resizeMode="cover"
        onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
      />
      <Text style={styles.characterName}>{ArmoryProfile.CharacterName}</Text>
      <Text>전투 레벨: {ArmoryProfile.TownLevel}</Text>
      <Text>아이템 레벨: {ArmoryProfile.ItemAvgLevel}</Text>
      <Text>장비</Text>
      {Object.keys(groupedEquipment).map((type, index) => (
        <EquipmentSection key={index} type={ArmoryEquipment.Type} items={groupedEquipment[type]} />
      ))}


    </ScrollView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  resultContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  characterImage: {
    width: '50%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default App;
