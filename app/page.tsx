'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Museum = {
  id: number
  name: string
  address: string
  officialUrl: string
}

export default function MuseumList() {
  const [museums, setMuseums] = useState<Museum[]>([])

  const fetchMuseums = () => {
    fetch('/api/rest/museums')
      .then((res) => res.json())
      .then(setMuseums)
  }

  useEffect(() => {
    fetchMuseums()
  }, [])

  const handleDelete = async (id: number) => {
    await fetch(`/api/rest/museums/${id}`, { method: 'DELETE' })
    fetchMuseums()
  }

  return (
    <main>
      <h1>美術館・博物館の鑑賞記録</h1>
      <ul>
        {museums.map((m) => (
          <li key={m.id}>
            <Link href={`/museums/${m.id}`}>{m.name}</Link>
            <button onClick={() => handleDelete(m.id)}>削除</button>
          </li>
        ))}
      </ul>
      <Link href="/museums/add">
        <button>美術館・博物館を追加</button>
      </Link>
    </main>
  )
}
