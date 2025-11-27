import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

export async function pickAndUploadAvatar(contactId){
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing:true,
        quality: 0.7,
        base64: Platform.OS === 'web',
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) return null;

    let formData = new FormData();

    if(Platform.OS === 'web'){
        const base64data = result.assets[0].base64;
        const blob = await fetch(`data:image/jpeg;base64,${base64data}`).then(res => res.blob());

        formData.append('avatar', blob, 'avatar.jpg');
    }else {
        const uri = result.assets[0].uri;
        const ext = uri.split('.').pop();
        formData.append('avatar',{
            uri,
            type: `image/${ext}`,
            name: `avatar.${ext}`,
        })
    }
    const uploadRes = await api.put(`/edit/${contactId}/avatar`,formData,{
        headers: { 'Content-Type': 'multipart/form-data'}
    })
    return uploadRes.data?.path || null;
}