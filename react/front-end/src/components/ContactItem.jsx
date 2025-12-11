import React, { useState, useEffect } from "react";
import AvatarPicker from "./AvatarPicker";  // web version
import "../styles/ContactItem.css"; // optional external CSS

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

  useEffect(() => {
    if (isEditing) {
      setName(contact.name);
      setPhone(contact.phone);
    }
  }, [isEditing]);

  return (
    <div style={styles.card}>
      <div style={styles.row}>

        {/* Avatar Picker */}
        <AvatarPicker
          avatarUrl={contact.avatar ? contact.avatarUrl : null}
          onSelect={onChangeAvatar}
        />

        {isEditing ? (
          /* EDIT MODE */
          <div style={styles.infoContainer}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Name"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              placeholder="Phone"
            />

            <div style={styles.actions}>
              <button
                onClick={() => onSave({ name, phone })}
                style={styles.iconBtn}
              >
                <i className="fa-solid fa-floppy-disk" style={{ color: "green" }}></i>
              </button>

              <button onClick={onCancel} style={styles.iconBtn}>
                <i className="fa-solid fa-xmark" style={{ color: "red" }}></i>
              </button>
            </div>
          </div>
        ) : (
          /* DISPLAY MODE */
          <div style={styles.infoContainer}>
            <div style={styles.name}>{contact.name}</div>
            <div style={styles.phone}>{contact.phone}</div>

            <div style={styles.actions}>
              <button onClick={onEdit} style={styles.iconBtn}>
                <i className="fa-solid fa-pen-to-square"></i>
              </button>

              <button onClick={onDelete} style={styles.iconBtn}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#d1d1d1",
    borderRadius: 10,
    padding: 12,
    margin: 6,
    width: "100%",
    minHeight: 100,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "6px",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },
  actions: {
    display: "flex",
    gap: "14px",
    marginTop: "6px",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
};
