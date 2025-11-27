import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import {useLocalSearchParams, useRouter } from 'expo-router'
import { pickAndUploadAvatar } from '../utils/uploadAvatar';


export default function EditContactScreen() {
  const router = useRouter()
  const { contactId } = useLocalSearchParams();
  const [contact, UseContact] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(()=> {
    const fetchContact = async () =>{
      try{
        const res = await api.get(`/${contactId}`);
        UseContact(res.data);
        setName(res.data.name);
        setPhone(res.data.phone);
        setAvatar(res.data.avatar);
      }catch(err){
        console.error("error fetching contact",err.message)
      }
    }
    if (contactId)fetchContact()
  },[contactId])

if (!contact) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading contact...</Text>
    </View>
  );
}



const handlePickAvatar = async () => {
  try{
    const uploadedPath = await pickAndUploadAvatar(contact._id);
    if(uploadedPath){
      setAvatar(uploadedPath);
      Alert.alert('success', 'Avatar uploaded successfully')
    }else{
      Alert.alert('cancelled','no image selected')
    }
  }catch(err){
    Alert.alert('Upload Error',err.message)
  }
}

  const handleUpdate = async () => {
    try {
     let avatarPath = avatar;

      if (avatar && avatar.startsWith('file')) {
        const formData = new FormData();
        const ext = avatar.split('.').pop();
        formData.append('avatar',{
          uri: avatar,
          type: `image/${ext}`,
          name: `avatar.${ext}`,
       });
    const uploadRes = await api.put(`/edit/${contact._id}/avatar` ,formData,{
        headers:{'Content-Type': 'multipart/form-data'},
      });
       if (uploadRes.data?.path) {
        // Build full URL for preview
        avatarPath =  uploadRes.data.path;;
      }
    }


      await api.put(`/edit/${contact._id}`,{
      name,
      phone,
      updatedAt:new Date().toISOString(),
      avatar: avatarPath,
       })
      
      Alert.alert('Success', 'Contact updated!');
      router.push('/');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = async () => {
    try {
      
      await api.delete(`/delete/${contact._id}`);
      Alert.alert('Deleted', 'Contact removed.');
      router.goBack();
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

      <TouchableOpacity onPress={handlePickAvatar}>
        {avatar ? (
        <Image
            source={{ uri: avatar.startsWith('/uploads') ? `${api.defaults.baseURL}${avatar}` : avatar }}
            style={styles.avatar}
          />) : (
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
