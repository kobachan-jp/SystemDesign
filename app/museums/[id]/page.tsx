'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, use } from 'react'

type Exhibition = {
  id: number
  title: string
  startDate: string
  endDate: string
  officialUrl: string
  description?: string
}

type Museum = {
  id: number
  name: string
  address: string
  officialUrl: string
  description?: string
  exhibitions: Exhibition[]
}

export default function MuseumDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [museum, setMuseum] = useState<Museum | null>(null)
  const { id } = use(params)

  const fetchMuseums = useCallback(() => {
    fetch(`/api/rest/museums/${id}`)
      .then((res) => res.json())
      .then(setMuseum)
  }, [id])

  useEffect(() => {
    fetchMuseums()
  }, [id])

  if (!museum) return <div>Loading ... </div>

  const exhibitionDelete = async (id: number) => {
    await fetch(`/api/rest/exhibitions/${id}`, { method: 'DELETE' })
    fetchMuseums()
  }

  return (
    <main>
      <h1>{museum.name}</h1>
      <p>住所：{museum.address}</p>
      <p>
        <Link
          href={museum.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Site
        </Link>
      </p>
      <p>{museum.description}</p>
      <Link href={`/museums/${id}/edit`}>
        <button>編集</button>
      </Link>
      <h2>展覧会一覧</h2>
      <ul>
        {museum.exhibitions.map((ex) => (
          <li key={ex.id}>
            <Link href={`/exhibitions/${ex.id}`}>{ex.title}</Link>
            <button onClick={() => exhibitionDelete(ex.id)}>削除</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
