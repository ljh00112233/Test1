import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { API_KEY, API_BASE_URL } from './apiKey';
import { Link } from "expo-router";

const App = () => {
  const [characterName, setCharacterName] = useState('');
  const [siblingsData, setSiblingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  };

  const searchSiblings = async () => {
    const response = await axios.get(`${API_BASE_URL}/${characterName}/siblings`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    const data = response.data;
    if(data.length === 0){
      setError(null);
      setSiblingsData(null);
      setError('원정대 정보를 찾을 수 없습니다.');
      return;
    }
    if (!characterName) {
      setError(null);
      setSiblingsData(null);
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

      const data = response.data;
      setSiblingsData(data);
      if(!data){
        setError('원정대 정보를 찾을 수 없습니다.');  
      }
    } catch (err) {
      setError('원정대 정보를 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
                  <TouchableOpacity style={styles.LOAHUBButton}>
                <Link
                href='../../List'>
                    <Text style={{fontSize:50, color: '#F7F7F0'}}>LOAHUB</Text>
                </Link>
            </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={scrollToTop}>
        <Text style={styles.buttonText}>▲</Text>
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="캐릭터 이름"
          placeholderTextColor='#7D818C'
          value={characterName}
          onChangeText={setCharacterName}
          onSubmitEditing={searchSiblings}
        />
        <Button title="검색" color='#37393A' onPress={searchSiblings} />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {siblingsData && (
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={siblingsData}
            keyExtractor={(item) => item.CharacterName}
            renderItem={({ item }) => (
              <View style={styles.resultContainer}>
                <Text>서버: {item.ServerName}</Text>
                <Text>이름: {item.CharacterName}</Text>
                <Text>전투레벨: {item.CharacterLevel}</Text>
                <Text>클래스: {item.CharacterClassName}</Text>
                <Text>아이템레벨: {item.ItemMaxLevel}</Text>
              </View>
            )}
          />
        </View>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#151720'
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
    backgroundColor: '#37393A',
    color: '#FFFFFF',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  resultContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    position: 'absolute',
    bottom: 3,
    right: 1,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  LOAHUBButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
