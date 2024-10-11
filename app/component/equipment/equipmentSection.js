import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const EquipmentSection = ({ items }) => {
  return (
    <View style={styles.sectionContainer}>
        {items.map((item, index) => (
            <View style={styles.sectionContainer}>
                <Text key={index} style={styles.itemText}>
                    {item.Type}
                </Text>
                <Image
                source={{ uri: `${item.Icon}` }}
                style={styles.equipmentImage}
                resizeMode="cover"
                onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                />
                <Text key={index} style={styles.itemText}>
                    {item.Name}
                </Text>
                <Text key={index} style={styles.itemText}>
                    {item.Grade}
                </Text>
            </View>
            ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  itemText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
    marginBottom: 4,
  },
  equipmentImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
});

export default EquipmentSection;
