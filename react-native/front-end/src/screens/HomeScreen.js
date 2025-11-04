import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import ContactItem from '../components/ContactItem';

export default function HomeScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/', { params: { page, search } });
      console.log(' Backend response:', res.data);
      setContacts(res.data.phonebooks || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(' Error fetching contacts:', err.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, search]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(' Error deleting contact:', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-contact')}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Search name or phone..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Contact List */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ContactItem
            contact={item}
            onPress={() =>
              router.push({
                pathname: '/edit-contact',
                params: { contactId: item._id },
              })
            }
            onDelete={() => handleDelete(item._id)}
          />
        )}
      />

      {/* Pagination */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageBtn: { padding: 10, backgroundColor: '#eee', borderRadius: 6 },
  addBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
});
