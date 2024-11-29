import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';

const announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('https://developer-lostark.game.onstove.com/news/notices', {
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA2ODcifQ.gOFES_0YYIbk9lgGSjUt1aGE9Euya9PA2JpDhHXvmVb_xtkCZd-DTKORRhMilfno0ryG2BNfSM1Qz-u43dh58-B1ho-gAcmkuTUVZ0XH6pXduiYaaWNPqZkakzJaMVeoNbq7riuHUfTdNFB0S02zcHCYzTy42VCiLGmnN1Zf7UcFwdatIrwqcqqeEsTh-g-beIva_8q8HA7uUGdwC2fPre74E7rIX8WUMsL9w6jqp_nXPKawjMJrol8VyfWVkc5yt6dYQZYW5r4e_kaG0VdXfr8_uoRZOhN6uTFpz3qxfegwZhMw2H8TNzJvGHN_5lpfeU8FH7K0SL-YuxaiqRwCkg'
          },
        });

        const limitedData = response.data
        setAnnouncements(limitedData);
        setLoading(false);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <TouchableOpacity 
          style={{flex: 1, backgroundColor: 'grey', padding: 5, borderRadius: 5}}
          onPress={() => openLink('https://lostark.game.onstove.com/News/Notice/List')}
        >
          <Text style={styles.text}>
            더보기
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.mainText}>공지사항</Text>
      </View>
      <FlatList
        data={announcements.slice(0, 6)}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openLink(item.Link)} style={styles.item}>
            <Text style={styles.title}>{item.Title || 'No Title'}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151720',
    margin: 10,
    borderStyle: 'solid',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  subContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  item: {
    flex: 1,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F7F0',
  },
  text: {
    fontSize: 15,
    color: '#F7F7F0',
  },
  characterImage: {
    width: 10,
    height:10,
    borderRadius: 8,
    marginBottom: 5,
  },
  mainText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F7F7F0',
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
});

export default announcement;