import React, { useState } from 'react';
import { useRouter } from 'expo-router'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker'; // use this if using Expo


export default function AddContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);

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

  const handleSave = async () => {
    // if (!name || !phone) {
    //   return Alert.alert('Error', 'Please fill all fields.');
    // }

    try {
      const formData = new FormData()
      formData.append('name',name);
      formData.append('phone',phone);

      const ext = avatar.split('.').pop();
      if (avatar) {
      formData.append('avatar',{
        uri:avatar,
        type:`image/${ext}`,
        name:`avatar.${ext}`,
      })
    }
    await api.post('/',formData,{
      headers:{'Content-Type': 'multipart/form-data'},
    })
      Alert.alert('Success', 'Contact added!');
      router.push('/');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Contact</Text>

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
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Save Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , backgroundColor: '#fff'},
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
    backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
