import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ContactItem({ contact }) {
    const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.phone}>{contact.phone}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  name: { fontSize: 16, fontWeight: 'bold' },
  phone: { color: '#666' },
});
