'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, use } from 'react'
type Museum = {
  id: number
  name: string
  address: string
  officialUrl: string
  description?: string
}

export default function MuseumEdit({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [museum, setMuseum] = useState<Museum | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [officialUrl, setOfficialUrl] = useState('')
  const [description, setDescription] = useState('')

  const { id } = use(params)

  useEffect(() => {
    fetch(`/api/rest/museums/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch museum')
        return res.json()
      })
      .then((data: Museum) => {
        setMuseum(data)
        setName(data.name)
        setAddress(data.address)
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
      const res = await fetch(`/api/rest/museums/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, officialUrl, description }),
      })
      if (!res.ok) throw new Error('Failed to update museum')
      router.push(`/museums/${id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading ...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>
  if (!museum) return <div>美術館が見つかりません</div>

  return (
    <main>
      <h1>美術館情報を編集</h1>
      <form onSubmit={handleSubmit}>
        <label>
          名前：
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          住所：
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          公式サイト：
          <input
            type="url"
            value={officialUrl}
            onChange={(e) => setOfficialUrl(e.target.value)}
          />
        </label>
        <br />
        <label>
          説明：
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">更新</button>
      </form>
    </main>
  )
}
