import React, { useEffect, useState, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import api from '../api/api'
import ContactItem from './ContactItem'

export default function ContactList({ initialSearch = '' }) {
  const [contacts, setContacts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 20

  const fetchPage = useCallback(async (p = 1, reset = false) => {
    const res = await api.get('/', { params: { page: p, limit, search: initialSearch } })
    const data = res.data.phonebooks || []
    const totalPages = res.data.totalPages || 1

    if (reset) setContacts(data)
    else setContacts(prev => [...prev, ...data])

    setHasMore(p < totalPages)
  }, [initialSearch])

  useEffect(() => { fetchPage(1, true); setPage(1) }, [initialSearch, fetchPage])

  const fetchNext = () => {
    const next = page + 1
    setPage(next)
    fetchPage(next)
  }

  const handleSave = async (id, payload) => {
    await api.put(`/edit/${id}`, payload)
    // optimistic local update:
    setContacts(prev => prev.map(c => c._id === id ? { ...c, ...payload } : c))
  }

  const handleAvatarUpload = async (id, image) => {
    const form = new FormData()
    if (image.file) form.append('avatar', image.file)
    else form.append('avatar', new File([await (await fetch(image.uri)).blob()], image.name || 'avatar.jpg', { type: image.type || 'image/jpeg' }))

    await api.put(`/edit/${id}/avatar`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    // refresh the single contact (or reload page 1)
    const res = await api.get(`/${id}`)
    setContacts(prev => prev.map(c => c._id === id ? res.data : c))
  }

  const handleDelete = async (id) => {
    await api.delete(`/${id}`)
    setContacts(prev => prev.filter(c => c._id !== id))
  }

  return (
    <InfiniteScroll
      dataLength={contacts.length}
      next={fetchNext}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}
    >
      {contacts.map(c => (
        <ContactItem
          key={c._id}
          contact={c}
          onSave={handleSave}
          onDelete={handleDelete}
          onAvatarSelect={handleAvatarUpload}
        />
      ))}
    </InfiniteScroll>
  )
}
