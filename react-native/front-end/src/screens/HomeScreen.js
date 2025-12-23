import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import ContactItem from '../components/ContactItem';
import useResponsive from "../../hooks/useResponsive";
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);

  // data & UI state
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const resettingRef = React.useRef(false);
  const contextIdRef = React.useRef(0);

  



  // sort state (moved inside component)
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const { columns } = useResponsive();

  const limit = 10;

  // fetchContacts now accepts optional order param
  const fetchContacts = useCallback(
    async (reset = false) => {
      const currentContextId = contextIdRef.current;

      setLoading(true);


      try {
        const res = await api.get('/', {
          params: { page: reset ? 1 : page, search, limit, sortBy: 'name', sortMode: sortOrder },
        });

       if (currentContextId !== contextIdRef.current) return;

        const pageData = res.data.phonebooks || [];
        const backendTotalPages = res.data.totalPages || 1;

        setContacts(prev => {
          if (reset) return pageData;

          const map = new Map(prev.map(item => [item._id, item]));
          pageData.forEach(item => map.set(item._id, item));
          return Array.from(map.values());
        });

        setTotalPages(backendTotalPages);
        setHasMore(page < backendTotalPages);
      } catch (err) {
        console.error('Error fetching contacts:', err.message);
      } finally {
        setLoading(false);
      }
    },
    [page, search, sortOrder]
  );


  // toggleSort: flip order, reset page, and reload (pass new order explicitly)


  useEffect(() => {
     contextIdRef.current += 1; 
    resettingRef.current = true;
    setContacts([]);
    setPage(1);
    fetchContacts(true).finally(() => {
      resettingRef.current = false;
      });
    }, [search, sortOrder]);


    useEffect(() => {
      if (page > 1) fetchContacts(false);
    }, [page, fetchContacts]);

    const toggleSort = () => {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    }

    const changeAvatar = async (id, image) => {
      try {
        const formData = new FormData();
        if (image?.file) {
          formData.append("avatar", image.file);
        } else if (image?.uri) {
          // MOBILE (ImagePicker)
          formData.append("avatar", {
            uri: image.uri,
            type: "image/jpeg",
            name: "avatar.jpg",
          });
        }
        // Upload ke backend
        await api.put(`/edit/${id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        reloadContacts();
      } catch (err) {
        console.error("Error uploading avatar:", err);
      }
    };

    const handleDelete = async (id) => {
      try {
        await api.delete(`/${id}`);
        // after delete, reload first page with current sort/search
        setPage(1);
        fetchContacts(true);
      } catch (err) {
        console.error('Error deleting:', err.message);
      }
    };
    const updateContact = async (id, data) => {
      try {
        await api.put(`/edit/${id}`, {
          ...data,
          avatar: data.avatar ?? data.oldAvatar
        });

        // reload data setelah save
        setEditingId(null);
        reloadContacts();
      } catch (err) {
        console.error("Error updating contact:", err.message);
      }
    };

    const reloadContacts = async () => {
      setPage(1);
      fetchContacts(true);
    };

    return (
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          {/* SORT BUTTON */}
          <TouchableOpacity style={styles.sortBtn} onPress={toggleSort}>
            <FontAwesome
              name={sortOrder === 'asc' ? 'sort-alpha-asc' : 'sort-alpha-desc'}
              size={18}
              color="#000"
            />
          </TouchableOpacity>

          {/* SEARCH BOX */}
          <View style={styles.searchWrapper}>
            <FontAwesome name="search" size={16} color="#444" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name or phone..."
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* ADD BUTTON */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/add-contact')}
          >
            <FontAwesome name="user-plus" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* GRID LIST */}
        <FlatList
          data={contacts}
          numColumns={columns}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={columns > 1 ? styles.row : null}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ContactItem
                contact={item}
                isEditing={editingId === item._id}
                onEdit={() => setEditingId(item._id)}
                onCancel={() => setEditingId(null)}
                onSave={(data) => updateContact(item._id, { ...data, avatar: item.avatar })}
                onDelete={() => handleDelete(item._id)}
                onChangeAvatar={(image) => changeAvatar(item._id, image)}
              />
            </View>
          )}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (hasMore && !loading && !resettingRef.current) {
              setPage(prev => prev + 1);
            }
          }}
        />
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 20,
      backgroundColor: "#FFF",
    },

    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    sortBtn: {
      width: 40,
      height: 40,
      backgroundColor: '#B8860B',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      marginRight: 10,
    },

    searchWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      borderRadius: 8,
      marginHorizontal: 6,
      height: 40,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 6,
    },

    addBtn: {
      width: 40,
      height: 40,
      backgroundColor: '#B8860B',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      marginLeft: 6,
    },

    grid: {
      paddingBottom: 40,
    },

    row: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 10,
      marginBottom: 10,
    },

    cardWrapper: {
      flex: 1,
      padding: 6,
      minWidth: 0,
    },
  });
