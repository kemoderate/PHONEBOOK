import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ContactItem({ contact, onPress, onDelete }) {
  return (
    <View style={styles.card}>
       <View style={styles.row}>
      {/* Avatar */}
      <Image
        source={
          contact.avatar
            ? { uri: `http://192.168.1.21:3001${contact.avatar}?t=${Date.now()}` } // Always check IP
            : require('../assets/avatar-placeholder.png')
        }
        style={styles.avatar}
      />

      {/* Info */}
           <View style={{ flex: 1 }}>
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
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#d1d1d1',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    flex: 1,
    flexShrink:0,
    minHeight: 100,
    maxHeight: 220,
    alignItems: 'center',
    flexGrow: 1,
    width: "100%",
    maxWidth: 350,
  },
  row:{
    flexDirection:"row",
    alignItems:"center",

  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  phone: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },
});
