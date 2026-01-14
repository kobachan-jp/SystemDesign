'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Exhibition } from '../lib/type'

export default function ExhibitionList() {
  const [exhibition, setExhibition] = useState<Exhibition[]>([])
  const [mode, setMode] = useState<'rest' | 'graphql'>('rest')

  const fetchExhibitions = async () => {
    if (mode === 'rest') {
      // REST API
      const res = await fetch('/api/rest/exhibitions')
      const data = await res.json()
      setExhibition(data)
    } else {
      // GraphQL
      const query = `
       query {
            exhibitions {
              id
              title
            }
          }
      `
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      //console.log(data)
      setExhibition(data.data.exhibitions)
    }
  }

  useEffect(() => {
    fetchExhibitions()
  }, [mode])

  const handleDelete = async (id: number) => {
    await fetch(`/api/rest/exhibitions/${id}`, { method: 'DELETE' })
    fetchExhibitions()
  }

  return (
    <main>
      <h1>展覧会一覧</h1>
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
        {exhibition.map((e) => (
          <li key={e.id}>
            <Link className="link-bold" href={`/exhibitions/${e.id}`}>
              {e.title}
            </Link>
            <button className="delete-btn" onClick={() => handleDelete(e.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
      <Link href="/exhibitions/new">
        <button>展覧会を追加</button>
      </Link>
      <p style={{ marginTop: '1rem', fontSize: '0.8em', color: 'gray' }}>
        {mode === 'rest' ? 'REST API' : 'GraphQL'} で取得した展覧会情報 <br />
        フィールド数：{exhibition[0] ? Object.keys(exhibition[0]).length : 0}
      </p>
    </main>
  )
}
