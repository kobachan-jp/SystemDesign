'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, use } from 'react'
import { Exhibition, Museum } from '@/app/lib/type'

export default function ExhibitionEdit({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [title, setTitle] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [officialUrl, setOfficialUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [museumId, setMuseumId] = useState<number | null>(null)
  const [museums, setMuseum] = useState<Museum[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { id } = use(params)

  useEffect(() => {
    fetch('/api/rest/museums')
      .then((res) => res.json())
      .then(setMuseum)
  }, [])

  useEffect(() => {
    fetch(`/api/rest/exhibitions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch exhibitions')
        return res.json()
      })
      .then((data: Exhibition) => {
        setExhibition(data)
        setTitle(data.title)
        setStartDate(new Date(data.startDate).toISOString().slice(0, 10))
        setEndDate(new Date(data.endDate).toISOString().slice(0, 10))
        setMuseumId(data.museumId)
        setOfficialUrl(data.officialUrl)
        setDescription(data.description ?? '')
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Unknown error'),
      )
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/rest/exhibitions/${id}`, {
        method: 'PUT',
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
      if (!res.ok) throw new Error('Failed to update exhibition')
      router.push(`/exhibitions/${id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading ...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>
  if (!exhibition) return <div>美術館が見つかりません</div>

  return (
    <main>
      <h1>展覧会情報を編集</h1>
      <form onSubmit={handleSubmit}>
        <label>
          美術館を選択：
          <select
            value={museumId ?? ''}
            onChange={(e) =>
              setMuseumId(e.target.value ? Number(e.target.value) : null)
            }
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
        <br />
        <label>
          展覧会タイトル：
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />

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
        <br />
        <label>
          公式サイト URL：
          <input
            type="url"
            value={officialUrl}
            onChange={(e) => setOfficialUrl(e.target.value)}
          />
        </label>
        <br />
        <label>
          説明：
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? '更新...' : '更新'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  )
}
