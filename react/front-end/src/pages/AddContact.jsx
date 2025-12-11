import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddContact() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); // preview on web
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (avatar) formData.append("avatar", avatar);

      await api.post("/", formData);

      alert("Contact added!");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Contact</h2>

      {/* Avatar Picker */}
      <label>
        {preview ? (
          <img src={preview} alt="avatar" style={styles.avatar} />
        ) : (
          <div style={styles.avatarPlaceholder}>Pick Avatar</div>
        )}
        <input type="file" onChange={pickImage} accept="image/*" style={{ display: "none" }} />
      </label>

      <input
        style={styles.input}
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button style={styles.btn} onClick={handleSave}>Save Contact</button>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: "30px auto", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    backgroundColor: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: 15,
  },
  btn: {
    width: "100%",
    padding: 15,
    backgroundColor: "#28a745",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
