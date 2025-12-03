import React, { useRef } from "react";
import { TouchableOpacity, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import useResponsive from "../hooks/useResponsive";

export default function AvatarPicker({ avatarUrl, onSelect }) {
  const { isDesktop } = useResponsive();
  const fileInputRef = useRef(null);

  // ========================
  // 📱 MOBILE — pake ImagePicker
  // ========================
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

  // ========================
  // 🖥️ DESKTOP — pake <input type="file">
  // ========================
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
      file, // kirim file mentah ke backend
    });
  };

  return (
    <>
      {/* AVATAR */}
      <TouchableOpacity onPress={isDesktop ? pickDesktop : pickMobile}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl + `?t=${Date.now()}` }
              : require("../assets/avatar-placeholder.png")
          }
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
      </TouchableOpacity>

      {/* FILE INPUT HIDDEN UNTUK DESKTOP */}
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
