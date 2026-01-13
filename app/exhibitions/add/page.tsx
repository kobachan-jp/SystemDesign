'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Museum, Exhibition } from '@/app/lib/type'

export default function MuseumAddPage() {
  const router = useRouter()

  // フォーム用 state
  const [title, setTitle] = useState<string>('')
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [officialUrl, setOfficialUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [museumId, setMuseumId] = useState<number>()
  const [museums, setMuseum] = useState<Museum[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetch('/api/rest/museums')
      .then((res) => res.json())
      .then(setMuseum)
  }, [])

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/rest/exhibitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          officialUrl,
          description,
          museumId,
        }),
      })

      if (!res.ok) {
        const data: Exhibition = await res.json()
        throw new Error('Failed to add museum')
      }

      // 成功したら一覧ページに遷移
      router.push('/exhibitions')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: '1rem' }}>
      <h1>展覧会を追加</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.5rem', maxWidth: '400px' }}
      >
        <label>
          美術館を選択
          <select
            value={museumId}
            onChange={(e) => setMuseumId(Number(e.target.value))}
            required
          >
            <option value="">選択してください</option>
            {museums.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          展覧会タイトル：
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          開催期間
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value.slice(0, 10))}
            required
          />
        </label>

        <label>
          ～
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value.slice(0, 10))}
            required
          />
        </label>

        <label>
          公式サイト URL：
          <input
            type="url"
            value={officialUrl}
            onChange={(e) => setOfficialUrl(e.target.value)}
          />
        </label>

        <label>
          説明：
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? '追加中...' : '追加'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  )
}
