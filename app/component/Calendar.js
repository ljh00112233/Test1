import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const Calendar = () => {
  const [Calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await axios.get('https://developer-lostark.game.onstove.com/gamecontents/calendar', {
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA2ODcifQ.gOFES_0YYIbk9lgGSjUt1aGE9Euya9PA2JpDhHXvmVb_xtkCZd-DTKORRhMilfno0ryG2BNfSM1Qz-u43dh58-B1ho-gAcmkuTUVZ0XH6pXduiYaaWNPqZkakzJaMVeoNbq7riuHUfTdNFB0S02zcHCYzTy42VCiLGmnN1Zf7UcFwdatIrwqcqqeEsTh-g-beIva_8q8HA7uUGdwC2fPre74E7rIX8WUMsL9w6jqp_nXPKawjMJrol8VyfWVkc5yt6dYQZYW5r4e_kaG0VdXfr8_uoRZOhN6uTFpz3qxfegwZhMw2H8TNzJvGHN_5lpfeU8FH7K0SL-YuxaiqRwCkg'
          },
        });

        const limitedData = response.data.slice(0, 5);
        setCalendar(limitedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
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
      data={Calendar}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => openLink(item.Link)} style={styles.item}>
          <Text style={styles.title}>{item.CategoryName || 'No Title'}</Text>
          <Text style={styles.title}>{item.ContentsName || 'No Title'}</Text>
          <Image
          source={{ uri: (`${item.ContentsIcon}`) }}
          style={styles.characterImage}
          resizeMode="cover"
          onError={(e) => console.log('이미지 로드 오류:', e.nativeCalendar.error)}
          />
          <Text style={styles.text}>{item.Location || 'No Title'}</Text>
          <Text style={styles.text}>{item.StartTimes[0] || 'No Title'}</Text>
          <Text style={styles.text}>{item.StartTimes[1] || 'No Title'}</Text>
          <Text style={styles.text}>{item.StartTimes[2] || 'No Title'}</Text>
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
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
});

export default Calendar;