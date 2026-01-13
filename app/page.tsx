'use client'

import { useEffect, useState } from 'react'
import { Exhibition } from '@/app/lib/type'
import Link from 'next/link'

export default function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])

  useEffect(() => {
    fetch('/api/rest/exhibitions')
      .then((res) => res.json())
      .then(setExhibitions)
  }, [])

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
      <h1>最新展覧会（5件）</h1>

      <ul>
        {exhibitions.slice(0, 5).map((ex) => (
          <li key={ex.id}>
            <Link href={`/exhibitions/${ex.id}`} style={{ fontWeight: 'bold' }}>
              {ex.title}
            </Link>

            <div>
              開催期間：
              {new Date(ex.startDate).toLocaleDateString('ja-JP')} 〜
              {new Date(ex.endDate).toLocaleDateString('ja-JP')}
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
        ※ REST API では、公式URL・説明・美術館の詳細情報など
        表示に不要なデータも含めて全件取得している 実際に取得した展覧会数：
        {exhibitions.length} 件
      </p>
    </main>
  )
}
