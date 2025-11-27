import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function ContactItem({ contact, onPress, onDelete }) {
  return (
    <View style={styles.card}>
      {/* Horizontal Row */}
      <View style={styles.row}>
        
        {/* Avatar kiri */}
        <Image
          source={
            contact.avatar
              ? { uri: `http://192.168.1.15:3001${contact.avatar}?t=${Date.now()}` }
              : require("../assets/avatar-placeholder.png")
          }
          style={styles.avatar}
        />

        {/* INFO + ACTION BUTTONS */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.phone}>{contact.phone}</Text>

          {/* Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onPress} style={styles.iconBtn}>
              <FontAwesome name="edit" size={18} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
              <FontAwesome name="trash" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

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
    justifyContent: "space-between",
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

  actions: {
    flexDirection: "row",
    gap: 14,
  },

  iconBtn: {
    paddingVertical: 4,
  }
});
