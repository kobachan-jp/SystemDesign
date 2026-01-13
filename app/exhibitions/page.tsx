'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Exhibition } from '../lib/type'

export default function ExhibitionList() {
  const [exhibition, setExhibition] = useState<Exhibition[]>([])

  const fetchExhibitions = () => {
    fetch('/api/rest/exhibitions')
      .then((res) => res.json())
      .then(setExhibition)
  }

  useEffect(() => {
    fetchExhibitions()
  }, [])

  const handleDelete = async (id: number) => {
    await fetch(`/api/rest/exhibitions/${id}`, { method: 'DELETE' })
    fetchExhibitions()
  }

  return (
    <main>
      <h1>展覧会一覧</h1>
      <ul>
        {exhibition.map((e) => (
          <li key={e.id}>
            <Link href={`/exhibitions/${e.id}`}>{e.title}</Link>
            <button onClick={() => handleDelete(e.id)}>削除</button>
          </li>
        ))}
      </ul>
      <Link href="/exhibitions/new">
        <button>展覧会を追加</button>
      </Link>
    </main>
  )
}
