'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Museum } from '../lib/type'

export default function MuseumList() {
  const [museums, setMuseums] = useState<Museum[]>([])
  const [mode, setMode] = useState<'rest' | 'graphql'>('rest')

  const fetchMuseums = async () => {
    if (mode === 'rest') {
      // REST API
      const res = await fetch('/api/rest/museums')
      const data = await res.json()
      setMuseums(data)
    } else {
      // GraphQL
      const query = `
        query {
          museums {
            id
            name
          }
        }
      `
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setMuseums(data.data.museums)
    }
  }

  useEffect(() => {
    fetchMuseums()
  }, [mode])

  const handleDelete = async (id: number) => {
    await fetch(`/api/rest/museums/${id}`, { method: 'DELETE' })
    fetchMuseums()
  }

  return (
    <main>
      <h1>美術館・博物館一覧</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setMode('rest')}
          disabled={mode === 'rest'}
          style={{ marginRight: '0.5rem' }}
        >
          REST
        </button>
        <button
          onClick={() => setMode('graphql')}
          disabled={mode === 'graphql'}
        >
          GraphQL
        </button>
      </div>
      <ul>
        {museums.map((m) => (
          <li key={m.id}>
            <Link className="link-bold" href={`/museums/${m.id}`}>
              {m.name}
            </Link>
            <button className="delete-btn" onClick={() => handleDelete(m.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '1rem', fontSize: '0.8em', color: 'gray' }}>
        {mode === 'rest' ? 'REST API' : 'GraphQL'} で取得した美術館・博物館情報{' '}
        <br />
        フィールド数：{museums[0] ? Object.keys(museums[0]).length : 0}
      </p>

      <Link href="/museums/new">
        <button>美術館・博物館を追加</button>
      </Link>
    </main>
  )
}
