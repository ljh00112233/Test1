import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const Event = () => {
  const [Events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://developer-lostark.game.onstove.com/news/events', {
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA2ODcifQ.gOFES_0YYIbk9lgGSjUt1aGE9Euya9PA2JpDhHXvmVb_xtkCZd-DTKORRhMilfno0ryG2BNfSM1Qz-u43dh58-B1ho-gAcmkuTUVZ0XH6pXduiYaaWNPqZkakzJaMVeoNbq7riuHUfTdNFB0S02zcHCYzTy42VCiLGmnN1Zf7UcFwdatIrwqcqqeEsTh-g-beIva_8q8HA7uUGdwC2fPre74E7rIX8WUMsL9w6jqp_nXPKawjMJrol8VyfWVkc5yt6dYQZYW5r4e_kaG0VdXfr8_uoRZOhN6uTFpz3qxfegwZhMw2H8TNzJvGHN_5lpfeU8FH7K0SL-YuxaiqRwCkg'
          },
        });

        const limitedData = response.data.slice(0, 5);
        setEvents(limitedData);
        setLoading(false);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  
  return (
    <FlatList
      data={Events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => openLink(item.Link)} style={styles.item}>
          <Text style={styles.title}>{item.Title || 'No Title'}</Text>
          <Image
          source={{ uri: (`${item.Thumbnail}`) }}
          style={styles.characterImage}
          resizeMode="cover"
          onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
          />
          <Text style={styles.text}>{item.StartDate || 'No Title'}~{item.EndDate || 'No Title'}</Text>
        </TouchableOpacity>
        
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text:{
    fontSize: 15,
    fontWeight: 'bold',
  },
    characterImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
});

export default Event;