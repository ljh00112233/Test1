// src/App.js
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { API_KEY, API_BASE_URL } from './apiKey';

const App = () => {
  const [characterName, setCharacterName] = useState('');
  const [siblingsData, setSiblingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchSiblings = async () => {
    if (!characterName) {
      setError('캐릭터 이름을 입력하세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setSiblingsData(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/${characterName}/siblings`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      const announcementsWithIds = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      setSiblingsData(announcementsWithIds);
    } catch (err) {
      console.error(err);
      setError('형제 캐릭터를 찾을 수 없습니다.');
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
        <Button title="검색" onPress={searchSiblings} />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {siblingsData && (
        <FlatList
          data={siblingsData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.resultContainer}>
              <Text style={styles.characterName}>{item.name}</Text>
              <Text>서버: {item.ServerName}</Text>
              <Text>이름: {item.CharacterName}</Text>
              <Text>전투레벨: {item.CharacterLevel}</Text>
              <Text>클래스: {item.CharacterClassName}</Text>
              <Text>아이템레벨: {item.ItemAvgLevel}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

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
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  resultContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default App;
