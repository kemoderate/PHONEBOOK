import React, { useRef } from "react";

export default function AvatarPicker({ avatarUrl, onChange }) {
  const fileRef = useRef(null);

  const pickImage = () =>{
    fileRef.current?.click();
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    if(!file) return;
 
  onChange({
      file,
      uri: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    });
  };

  return (
    <div>
      <img
        src={avatarUrl || "/avatar-placeholder.png"}
        onClick={pickImage}
        alt="avatar"
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          objectFit: "cover",
          cursor: "pointer",
          marginRight: 12,
        }}
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
