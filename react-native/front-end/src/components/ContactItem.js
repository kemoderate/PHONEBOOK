import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AvatarPicker from '../components/AvatarPicker';

export default function ContactItem({
  contact,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onChangeAvatar,
}) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);

  // setiap kali masuk mode edit → sync field
  useEffect(() => {
    if (isEditing) {
      setName(contact.name);
      setPhone(contact.phone);
    }
  }, [isEditing]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>

        {/* Avatar */}
          <AvatarPicker
            avatarUrl={
              contact.avatar
                ? `http://192.168.1.15:3001${contact.avatar}`
                : null
            }
            onSelect={onChangeAvatar}
          />
      

        {isEditing ? (
          // ========================
          // MODE EDIT (INPUT FORM)
          // ========================
          <View style={styles.infoContainer}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Name"
            />

            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
            />

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => onSave({ name, phone })}
                style={styles.iconBtn}
              >
                <FontAwesome name="save" size={20} color="green" />
              </TouchableOpacity>

              <TouchableOpacity onPress={onCancel} style={styles.iconBtn}>
                <FontAwesome name="times" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // ========================
          // MODE NORMAL (DISPLAY)
          // ========================
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.phone}>{contact.phone}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
                <FontAwesome name="edit" size={18} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
                <FontAwesome name="trash" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d1d1d1",
    borderRadius: 10,
    padding: 12,
    margin: 6,
    flex: 1,
    width: "100%",
    minHeight: 100,
    justifyContent: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  infoContainer: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },

  phone: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
    backgroundColor: "#fff",
  },

  actions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 6,
  },

  iconBtn: {
    paddingVertical: 4,
  },
});
