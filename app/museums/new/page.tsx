'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Museum = {
  id: number
  name: string
  address: string
  officialUrl: string
  description?: string
}

export default function MuseumAddPage() {
  const router = useRouter()

  // フォーム用 state
  const [name, setName] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [officialUrl, setOfficialUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/rest/museums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, officialUrl, description }),
      })

      if (!res.ok) {
        const data: Museum[] = await res.json()
        throw new Error('Failed to add museum')
      }

      // 成功したら一覧ページに遷移
      router.push('/')
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
      <h1>美術館を追加</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.5rem', maxWidth: '400px' }}
      >
        <label>
          名前：
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          住所：
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
