'use client'

import { useEffect, useState } from 'react'
import { Exhibition } from '@/app/lib/type'
import Link from 'next/link'

export default function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [mode, setMode] = useState<'rest' | 'graphql'>('rest')

  // 展覧会取得関数
  const fetchExhibitions = async () => {
    if (mode === 'rest') {
      // REST
      const res = await fetch('/api/rest/exhibitions')
      const data = await res.json()
      setExhibitions(data)
    } else {
      // GraphQL
      const query = `
        query {
          exhibitions(limit:5) {
            id
            title
            startDate
            endDate
            museum {
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
      setExhibitions(data.data.exhibitions)
    }
  }

  useEffect(() => {
    fetchExhibitions()
  }, [mode]) // モードが変わったら再取得
  return (
    <main>
      <nav style={{ marginBottom: '1rem' }}>
        <Link href="/museums" style={{ marginLeft: '0.5rem' }}>
          <button>美術館一覧</button>
        </Link>

        <Link href="/exhibitions" style={{ marginLeft: '0.7rem' }}>
          <button>展覧会一覧</button>
        </Link>

        <Link href="/museums/new" style={{ marginLeft: '0.7rem' }}>
          <button>美術館を追加</button>
        </Link>

        <Link href="/exhibitions/new" style={{ marginLeft: '0.7rem' }}>
          <button>展覧会を追加</button>
        </Link>
      </nav>

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

      <h1>最新展覧会（5件）</h1>

      <ul>
        {exhibitions.slice(0, 5).map((ex) => (
          <li key={ex.id}>
            <Link href={`/exhibitions/${ex.id}`} className="link-bold">
              {ex.title}
            </Link>

            <div>
              開催期間：
              {new Date(Number(ex.startDate)).toLocaleDateString('ja-JP')} 〜
              {new Date(Number(ex.endDate)).toLocaleDateString('ja-JP')}
            </div>
            <div>開催美術館：{ex.museum?.name ?? '取得されていません'}</div>
            {/*
            REST API では、展覧会と美術館は別リソースとして扱われるため、
            展覧会一覧取得時に美術館名は自動的には含まれない。
            このため、クライアント側で追加リクエストを行うか、
            不要な情報を含めた JOIN レスポンスを返す必要があり、
            over-fetching やリクエスト増加が発生しやすい。
*/}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '1rem', fontSize: '0.8em', color: 'gray' }}>
        {mode === 'rest' ? 'REST API' : 'GraphQL'} で取得した展覧会情報 <br />
        フィールド数：{exhibitions[0] ? Object.keys(exhibitions[0]).length : 0}
      </p>
    </main>
  )
}
