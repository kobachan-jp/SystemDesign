'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, use } from 'react'
import { Museum } from '@/app/lib/type'

export default function MuseumDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [museum, setMuseum] = useState<Museum | null>(null)
  const [mode, setMode] = useState<'rest' | 'graphql'>('rest')
  const { id } = use(params)

  // データ取得関数
  const fetchMuseum = useCallback(async () => {
    if (mode === 'rest') {
      const res = await fetch(`/api/rest/museums/${id}`)
      const data = await res.json()
      setMuseum(data)
    } else {
      const query = `
        query {
          museum(id: ${id}) {
            id
            name
            address
            officialUrl
            description
            exhibitions {
              id
              title
            }
          }
        }
      `
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setMuseum(data.data.museum)
    }
  }, [id, mode])

  useEffect(() => {
    fetchMuseum()
  }, [fetchMuseum])

  if (!museum) return <div>Loading ...</div>

  const exhibitionDelete = async (exId: number) => {
    await fetch(`/api/rest/exhibitions/${exId}`, { method: 'DELETE' })
    fetchMuseum()
  }

  return (
    <main>
      <nav style={{ marginBottom: '1rem' }}>
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
      </nav>

      <h1>{museum.name}詳細情報</h1>
      <p
        style={{ fontSize: '1.4rem', lineHeight: 1.6, marginBottom: '0.8rem' }}
      >
        住所：{museum.address}
      </p>
      <iframe
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          museum.address,
        )}&output=embed`}
      ></iframe>
      <p
        style={{ fontSize: '1.4rem', lineHeight: 1.6, marginBottom: '0.8rem' }}
      >
        <Link
          className="link-bold"
          style={{
            fontSize: '1.4rem',
            lineHeight: 1.6,
            marginBottom: '0.8rem',
          }}
          href={museum.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Siteはこちらをクリック
        </Link>
      </p>
      <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '0.8rem' }}>
        メモ：{museum.description}
      </p>
      <Link href={`/museums/${id}/edit`}>
        <button>編集</button>
      </Link>

      <h2>展覧会一覧</h2>
      <ul>
        {museum.exhibitions?.map((ex) => (
          <li key={ex.id}>
            <Link className="link-bold" href={`/exhibitions/${ex.id}`}>
              {ex.title}
            </Link>
            <button
              className="delete-btn"
              onClick={() => exhibitionDelete(ex.id)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '1rem', fontSize: '0.8em', color: 'gray' }}>
        {mode === 'rest' ? 'REST API' : 'GraphQL'} で取得した美術館・博物館情報{' '}
        <br />
        フィールド数：
        {museum ? Object.keys(museum).length : 0}
      </p>
    </main>
  )
}
