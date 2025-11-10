import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ContactItem({ contact, onPress, onDelete }) {
  return (
    <View style={styles.card}>
      {/* Avatar */}
      <Image
        source={
          contact.avatar
            ? { uri: `http://192.168.1.21:3001${contact.avatar}` } // Always check IP
            : require('../assets/avatar-placeholder.png')
        }
        style={styles.avatar}
      />

      {/* Info */}
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.phone}>{contact.phone}</Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onPress}>
          <FontAwesome name="edit" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <FontAwesome name="trash" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  phone: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },
});
