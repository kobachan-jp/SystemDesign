'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, use } from 'react'
import { Exhibition } from '@/app/lib/type'

export default function ExhibitionDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [mode, setMode] = useState<'rest' | 'graphql'>('rest')
  const { id } = use(params)

  const fetchExhibition = useCallback(async () => {
    if (mode === 'rest') {
      const res = await fetch(`/api/rest/exhibitions/${id}`)
      const data = await res.json()
      setExhibition(data)
    } else {
      const query = `
        query {
          exhibition(id: ${id}) {
            id
            title
            startDate
            endDate
            officialUrl
            description
            museum {
              id
              name
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
      setExhibition(data.data.exhibition)
    }
  }, [id, mode])

  useEffect(() => {
    fetchExhibition()
  }, [fetchExhibition])

  if (!exhibition) return <div>Loading ...</div>

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

      <h1>{exhibition.title}の詳細ページ</h1>
      <p
        style={{ fontSize: '1.4rem', lineHeight: 1.6, marginBottom: '0.8rem' }}
      >
        開催期間：
        {new Date(Number(exhibition.startDate)).toLocaleDateString('ja-JP')} 〜
        {new Date(Number(exhibition.endDate)).toLocaleDateString('ja-JP')}
      </p>
      <p
        style={{ fontSize: '1.4rem', lineHeight: 1.6, marginBottom: '0.8rem' }}
      >
        開催場所：{' '}
        <Link className="link-bold" href={`/museums/${exhibition.museum?.id}`}>
          {exhibition.museum?.name ?? '取得されていません'}
        </Link>
      </p>
      <p>
        <Link
          className="link-bold"
          href={exhibition.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Site
        </Link>
      </p>
      <p>{exhibition.description}</p>

      <Link href={`/exhibitions/${id}/edit`}>
        <button>編集</button>
      </Link>
      <p style={{ marginTop: '1rem', fontSize: '0.8em', color: 'gray' }}>
        {mode === 'rest' ? 'REST API' : 'GraphQL'} で取得した美術館情報 <br />
        フィールド数：{Object.keys(exhibition.museum ?? {}).length}
      </p>
    </main>
  )
}
