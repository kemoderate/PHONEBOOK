import React, { useRef } from "react";
import { TouchableOpacity, Image, Platform ,Alert} from "react-native";
import * as ImagePicker from "expo-image-picker";
import useResponsive from "../../hooks/useResponsive";



export default function AvatarPicker({ avatarUrl, onSelect }) {
    const { isDesktop } = useResponsive();
    const fileInputRef = useRef(null);


const showMobileOptions = () => {
    Alert.alert(
        "Change Avatar",
        "Choose an option",
        [
            { text: "Camera", onPress: takePhotoMobile },
            { text: "Gallery", onPress: pickMobile },
            { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
    );
};

    // 📱 MOBILE —  ImagePicker

    const pickMobile = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            onSelect(result.assets[0]);
        }
    };

    const takePhotoMobile = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    });

    if (!result.canceled) {
        onSelect(result.assets[0]);
    }
};



    // DESKTOP — pake <input type="file">

    const pickDesktop = () => {
        fileInputRef.current?.click();
    };

    const onFileSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uri = URL.createObjectURL(file);
        onSelect({
            uri,
            name: file.name,
            type: file.type,
            file,
        });
    };

    return (
        <>
            {/* AVATAR */}
            <TouchableOpacity onPress={isDesktop ? pickDesktop : showMobileOptions}>
                <Image
                    key={avatarUrl + Date.now()}
                    source={avatarUrl ? { uri: avatarUrl } : require("../assets/avatar-placeholder.png")}
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                />
            </TouchableOpacity>


            {isDesktop && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={onFileSelected}
                />
            )}
        </>
    );
}
