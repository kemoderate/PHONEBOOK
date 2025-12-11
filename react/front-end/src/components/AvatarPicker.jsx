import React, { useRef } from 'react'

export default function AvatarPicker({ avatarUrl, onSelect, size = 60 }) {
  const ref = useRef()

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    // For previewing we can generate a blob URL
    const preview = URL.createObjectURL(file)
    // send file object to parent
    onSelect({ file, uri: preview, name: file.name, type: file.type })
  }

  return (
    <>
      <div style={{ width: size, height: size, borderRadius: size/2, overflow: 'hidden', cursor: 'pointer' }} onClick={() => ref.current.click()}>
        <img
          src={avatarUrl ? `${avatarUrl}?t=${Date.now()}` : '/avatar-placeholder.png'}
          alt="avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </>
  )
}
