import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import ContactItem from '../components/ContactItem';
import { useFocusEffect } from '@react-navigation/native';
import useResponsive from "../../hooks/useResponsive";


export default function HomeScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // ⚠ FIX RESPONSIVE HOOK
  const { isDesktop, columns } = useResponsive();
  const limit = 16;

  const fetchContacts = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await api.get('/', { params: { page, search, limit } });
      const pageData = res.data.phonebooks || [];
      const backendTotalPages = res.data.totalPages || 1;

      reset
        ? setContacts(pageData)
        : setContacts(prev => [...prev, ...(pageData || [])]);

      setTotalPages(backendTotalPages);
      setHasMore(page < backendTotalPages);
    } catch (err) {
      console.error('Error fetching contacts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setContacts([]);
      setPage(1);
      fetchContacts(true);
    }, [search])
  );

  useEffect(() => {
    if (page > 1) fetchContacts();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchContacts(true);
    } catch (err) {
      console.error('Error deleting:', err.message);
    }
  };

  return (
    <View style={styles.container}>

      {/* ⚠ MOVE PAGINATION *INSIDE* CONTAINER */}
      {isDesktop && (
        <View style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setPage(i + 1);
                fetchContacts(true);
              }}
              style={[styles.pageBtn, i + 1 === page && { backgroundColor: '#007bff' }]}
            >
              <Text style={{ color: i + 1 === page ? '#fff' : '#000' }}>
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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

      {/* List */}
      <FlatList
        data={contacts}
        key={columns}   // ✔ rerender on layout change
        numColumns={columns}   // ✔ responsive grid
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
           <View style={{ flex: 1 / columns }}>
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
          </View>
        )}
        onEndReachedThreshold={0.01}
        onEndReached={() => {
          if (hasMore && !loading) {
            setPage(prev => prev + 1);
          }
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', marginBottom: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  pagination: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 6
  },
  pageBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6
  },
  addBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  grid:{
    paddingBottom: 40,
  }
});
