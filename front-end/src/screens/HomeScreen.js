import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';
import ContactItem from '../components/ContactItem';

export default function HomeScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/', { params: { page, search } });
      console.log('back end respond',res.data)
      setContacts(res.data.phonebooks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching contacts:', err.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, search]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📞 Phonebook</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search name or phone..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ContactItem
            contact={item}
            onPress={() => navigation.navigate('EditContact', { contact: item })}
          />
        )}
      />

      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page <= 1}
          onPress={() => setPage(page - 1)}
          style={[styles.pageBtn, page <= 1 && { opacity: 0.4 }]}
        >
          <Text>Prev</Text>
        </TouchableOpacity>

        <Text>{page} / {totalPages}</Text>

        <TouchableOpacity
          disabled={page >= totalPages}
          onPress={() => setPage(page + 1)}
          style={[styles.pageBtn, page >= totalPages && { opacity: 0.4 }]}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Text style={styles.addText}>+ Add Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  searchInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 10
  },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageBtn: { padding: 10, backgroundColor: '#eee', borderRadius: 6 },
  addBtn: {
    marginTop: 20, backgroundColor: '#007bff',
    padding: 15, borderRadius: 8, alignItems: 'center'
  },
  addText: { color: '#fff', fontWeight: 'bold' },
});
