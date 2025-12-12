import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import HomeScreen from "@/src/screens/HomeScreen";

export default function Index() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    fetch("http://192.168.1.9:3001/api/phonebooks")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.phonebooks || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return <HomeScreen contacts={contacts} />;
}
