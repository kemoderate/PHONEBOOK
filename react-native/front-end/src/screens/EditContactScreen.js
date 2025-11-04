import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router'


export default function EditContactScreen() {
  const router = useRouter()
  const { contactId } = router.query;
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [avatar, setAvatar] = useState(contact.avatar);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/edit/${contact._id}`, { name, phone, updatedAt: new Date() });
      if (avatar && avatar.startsWith('file')) {
        await uploadAvatar(contact._id);
      }
      Alert.alert('Success', 'Contact updated!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/delete/${contact._id}`);
      Alert.alert('Deleted', 'Contact removed.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const uploadAvatar = async (id) => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: avatar,
      type: 'image/jpeg',
      name: 'avatar.jpg'
    });
    await api.put(`/edit/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Contact</Text>

      <TouchableOpacity onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>Pick Avatar</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#dc3545' }]} onPress={handleDelete}>
        <Text style={styles.btnText}>Delete Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 15
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15
  },
  btn: {
    backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10
  },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
