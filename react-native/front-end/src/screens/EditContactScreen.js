import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditContactScreen() {
  const router = useRouter();
  const { contactId } = useLocalSearchParams();
  const [contact, setContact] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(`/${contactId}`);
        setContact(res.data);
        setName(res.data.name);
        setPhone(res.data.phone);
        setAvatar(res.data.avatar);
      } catch (err) {
        console.error("error fetching contact", err.message);
      }
    };
    if (contactId) fetchContact();
  }, [contactId]);

  if (!contact) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading contact...</Text>
      </View>
    );
  }

  // Camera permission request
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return false;
    }
    return true;
  };

  // Show picker options (Camera or Gallery)
  const showImagePickerOptions = () => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Pick from gallery
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      let avatarPath = avatar;

      // If new avatar selected (starts with 'file://')
      if (avatar && (avatar.startsWith('file') || avatar.startsWith('content'))) {
        const formData = new FormData();
        const ext = avatar.split('.').pop();
        formData.append('avatar', {
          uri: avatar,
          type: `image/${ext}`,
          name: `avatar.${ext}`,
        });

        const uploadRes = await api.put(`/edit/${contact._id}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadRes.data?.path) {
          avatarPath = uploadRes.data.path;
        }
      }

      // Update contact info
      await api.put(`/edit/${contact._id}`, {
        name,
        phone,
        updatedAt: new Date().toISOString(),
        avatar: avatarPath,
      });

      Alert.alert('Success', 'Contact updated!');
      router.push('/');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/${contact._id}`);
              Alert.alert('Deleted', 'Contact removed.');
              router.push('/');
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  // Get full avatar URL
  const getAvatarUri = () => {
    if (!avatar) return null;
    
    // New photo from picker (local file)
    if (avatar.startsWith('file') || avatar.startsWith('content')) {
      return avatar;
    }
    
    // Existing photo from server
    if (avatar.startsWith('/uploads')) {
      return `${api.defaults.baseURL.replace('/api', '')}${avatar}`;
    }
    
    // Full URL
    return avatar;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Contact</Text>

      <TouchableOpacity onPress={showImagePickerOptions}>
        {avatar ? (
          <Image
            source={{ uri: getAvatarUri() }}
            style={styles.avatar}
          />
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
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: '#dc3545' }]} 
        onPress={handleDelete}
      >
        <Text style={styles.btnText}>Delete Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 15,
    alignSelf: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});