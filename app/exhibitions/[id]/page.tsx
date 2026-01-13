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
  const { id } = use(params)

  const fetchExhibitions = useCallback(() => {
    fetch(`/api/rest/exhibitions/${id}`)
      .then((res) => res.json())
      .then(setExhibition)
  }, [id])

  useEffect(() => {
    fetchExhibitions()
  }, [id])

  if (!exhibition) return <div>Loading ... </div>

  return (
    <main>
      <h1>{exhibition.title}</h1>
      <Link href={`/museums/${exhibition.museumId}`}>
        開催場所：{exhibition.museum?.name ?? '取得されていません'}
      </Link>
      <p>
        <Link
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
    </main>
  )
}
