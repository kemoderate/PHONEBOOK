import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AvatarPicker from "../components/AvatarPicker";

export default function EditContact() {
  const { contactId } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);      // avatar URL or file preview
  const [avatarFile, setAvatarFile] = useState(null); // actual file object

  // Fetch the contact
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(`/${contactId}`);
        setContact(res.data);

        setName(res.data.name);
        setPhone(res.data.phone);
        setAvatar(res.data.avatar);  // URL or path
      } catch (err) {
        console.error("Error fetching contact:", err.message);
      }
    };

    if (contactId) fetchContact();
  }, [contactId]);

  if (!contact) {
    return (
      <div style={styles.center}>
        <p>Loading contact...</p>
      </div>
    );
  }

  // When user selects an avatar
  const handleAvatarChange = (fileObject) => {
    setAvatar(fileObject.uri);    // preview URL
    setAvatarFile(fileObject.file);
  };

  const handleUpdate = async () => {
    try {
      let avatarPath = avatar;

      // 1. Upload new avatar file if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const uploadRes = await api.put(
          `/edit/${contact._id}/avatar`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (uploadRes.data?.path) {
          avatarPath = uploadRes.data.path;
        }
      }

      // 2. Update contact info
      await api.put(`/edit/${contact._id}`, {
        name,
        phone,
        updatedAt: new Date().toISOString(),
        avatar: avatarPath,
      });

      alert("Contact updated!");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/delete/${contact._id}`);
      alert("Contact removed.");
      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Contact</h2>

      {/* Avatar Picker */}
      <AvatarPicker avatarUrl={avatar} onSelect={handleAvatarChange} />

      <input
        style={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        style={styles.input}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button style={styles.btn} onClick={handleUpdate}>
        Update Contact
      </button>

      <button
        style={{ ...styles.btn, backgroundColor: "#dc3545" }}
        onClick={handleDelete}
      >
        Delete Contact
      </button>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: "20px auto", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold" },
  input: {
    width: "100%",
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  btn: {
    width: "100%",
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 6,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    marginBottom: 10,
    fontWeight: "bold",
  },
  center: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  },
};
