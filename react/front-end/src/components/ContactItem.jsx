import React, { useState, useEffect } from "react";
import AvatarPicker from "./AvatarPicker";
import "../styles/ContactItem.css";

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
  }, [isEditing, contact.name, contact.phone]);

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        {/* Avatar Picker */}
        <AvatarPicker
          avatarUrl={contact.avatar}
          onChange={onChangeAvatar}
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
                title="Save"
              >
                <i className="fa-solid fa-floppy-disk" style={{ color: "green" }}></i>
              </button>
              <button onClick={onCancel} style={styles.iconBtn} title="Cancel">
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
              <button onClick={onEdit} style={styles.iconBtn} title="Edit">
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button onClick={onDelete} style={styles.iconBtn} title="Delete">
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
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    width: "100%",
  },
  infoContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    minWidth: 0, // Important: allows flex item to shrink below content size
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    wordBreak: "break-word",
  },
  phone: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    wordBreak: "break-word",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "6px",
    borderRadius: "6px",
    border: "1px solid #aaa",
    boxSizing: "border-box",
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "auto", 
    paddingTop: "4px",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};