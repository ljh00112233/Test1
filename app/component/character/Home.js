import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import Character from './character'

const Home = () => {
  const scrollViewRef = useRef(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <Character />
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={scrollToTop}>
        <Text style={styles.buttonText}>▲</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151720'
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  textItem: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  subConatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1D22',
    borderRadius: 10,
    margin: 15,
  },
  text: {
    fontSize: 100,
    color: 'white',
  }
});

export default Home;