// src/pages/Home.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpAZ, faArrowDownZA, faUserPlus, faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";
import ContactItem from "../components/ContactItem";

export default function Home() {
  const navigate = useNavigate();

  
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [editingId, setEditingId] = useState(null);

  
  const [columns, setColumns] = useState(getColumns(window.innerWidth));

  
  const searchDebounceRef = useRef(null);

  const sentinelRef = useRef(null);

  
  const paramsRef = useRef({ page, search, sortOrder });

  
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    const serverURL = api.defaults.baseURL.replace(/\/api.*/, "");
  return `${serverURL}${avatarPath}`;
  };

 
  function handleResize() {
    setColumns(getColumns(window.innerWidth));
  }
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchContacts = useCallback(
    async (reset = false, order = sortOrder, currentPage = page) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await api.get("/", {
          params: {
            page: currentPage,
            search,
            limit,
            sortBy: "name",
            sortMode: order,
          },
        });

        const pageData = res.data.phonebooks || [];
        const backendTotalPages = res.data.totalPages || 1;

        if (reset) {
          setContacts(pageData);
        } else {
          setContacts((prev) => [...prev, ...(pageData || [])]);
        }

        setTotalPages(backendTotalPages);
        setHasMore(currentPage < backendTotalPages);
      } catch (err) {
        console.error("Error fetching contacts:", err.message);
      } finally {
        setLoading(false);
      }
    },
    
    [limit, search]
  );

  
  const reloadContacts = useCallback(async () => {
    setPage(1);
    
    await new Promise((res) => setTimeout(res, 20));
    fetchContacts(true, sortOrder, 1);
  }, [fetchContacts, sortOrder]);

  
  const toggleSort = () => {
    const next = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(next);
    setPage(1);
    fetchContacts(true, next, 1);
  };

  
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      reloadContacts();
    }, 350);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search, reloadContacts]);

  
  useEffect(() => {
    if (page === 1) return;
    fetchContacts(false, sortOrder, page);
    
  }, [page]);

  
  useEffect(() => {
    paramsRef.current = { page, search, sortOrder };
  }, [page, search, sortOrder]);

  
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading) {
            setPage((p) => p + 1);
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  
  const changeAvatar = async (id, image) => {
    try {
      const formData = new FormData();
      if (image?.file) {
      
        formData.append("avatar", image.file);
      } else if (image?.uri) {
        try {
          const response = await fetch(image.uri);           
          const blob = await response.blob();
          const filename = image.name || "avatar.jpg";
          const fileFromBlob = new File([blob], filename, { type: image.type || blob.type || "image/jpeg" });
          formData.append("avatar", fileFromBlob);
        } catch (e) {
          console.error("Failed to convert uri to file:", e);
          return; 
        }
      }

      await api.put(`/edit/${id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      
      setPage(1);
      fetchContacts(true, sortOrder, 1);
    } catch (err) {
      console.error("Error uploading avatar:", err.message);
    }
  };

 
  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
    
      setPage(1);
      fetchContacts(true, sortOrder, 1);
    } catch (err) {
      console.error("Error deleting contact:", err.message);
    }
  };

  // ---------- update contact ----------
  const updateContact = async (id, data) => {
    try {
      await api.put(`/edit/${id}`, {
        ...data,
        avatar: data.avatar ?? data.oldAvatar,
      });

      setEditingId(null);
     
      setPage(1);
      fetchContacts(true, sortOrder, 1);
    } catch (err) {
      console.error("Error updating contact:", err.message);
    }
  };

  // ---------- initial load ----------
  useEffect(() => {
    setContacts([]);
    setPage(1);
    fetchContacts(true, sortOrder, 1);
   
  }, []);

  // ---------- render ----------
  return (
    <div style={styles.container}>
      {/* header */}
      <div style={styles.headerContainer}>
        <button style={styles.sortBtn} onClick={toggleSort} title= {sortOrder === "asc" ? "A → Z" : "Z → A"}>
         <FontAwesomeIcon
         icon={sortOrder === "asc" ? faArrowDownAZ : faArrowUpAZ }
         style={{color: "#000"}}
         />
        </button>

        <div style={styles.searchWrapper}>
          <span style={{ marginRight: 8 }}>🔍</span>
          <input
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            
            }}
            style={styles.searchInput}
          />
        </div>

        <button style={styles.addBtn} onClick={() => navigate("/add")}>
          <FontAwesomeIcon
            icon={faUserPlus} size="lg"
            style={{color: "#000" }}
          />
        </button>
      </div>

      {/* grid */}
      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {contacts.map((item) => (
          <div key={item._id} style={styles.cardWrapper}>
            <ContactItem
              contact={{
                ...item,
                avatar: getAvatarUrl(item.avatar), 
              }}
              isEditing={editingId === item._id}
              onEdit={() => setEditingId(item._id)}
              onCancel={() => setEditingId(null)}
              onSave={(data) => updateContact(item._id, { ...data, oldAvatar: item.avatar })}
              onDelete={() => handleDelete(item._id)}
              onChangeAvatar={(image) => changeAvatar(item._id, image)}
            />
          </div>
        ))}
      </div>

      {/* loading / end */}
      <div ref={sentinelRef} style={{ height: 40, marginTop: 10 }}>
        {loading ? <div style={{ textAlign: "center" }}>Loading...</div> : null}
        {!hasMore && !loading ? (
          <div style={{ textAlign: "center", color: "#666", padding: 12 }}>
            — end of list —
          </div>
        ) : null}
      </div>
    </div>
  );
}


function getColumns(width) {
  if (width < 640) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  return 4;
}

/* styles (JS objects) */
const styles = {
  container: {
    padding: 12,
    maxWidth: 1200,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sortBtn: {
    minWidth: 48,
    height: 40,
    backgroundColor: "#B8860B",
    border: "none",
    borderRadius: 6,
    color: "#ddd",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    padding: "0 10px",
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    border: "none",
    outline: "none",
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  addBtn: {
    minWidth: 72,
    height: 40,
    backgroundColor: "#B8860B",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gap: 10,
  },
  cardWrapper: {
    boxSizing: "border-box",
  },
};
