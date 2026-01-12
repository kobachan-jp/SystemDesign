import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

//全美術館を取得
export async function GET() {
  const museums = await prisma.museum.findMany()
  return NextResponse.json(museums)
}

//美術館を登録
export async function POST(req: NextRequest) {
  const { name, address, officialUrl, description } = await req.json()
  if (!name || !address || !officialUrl) {
    return NextResponse.json(
      { error: 'name, address, officialUrl are required' },
      { status: 400 },
    )
  }

  const museum = await prisma.museum.create({
    data: { name, address, officialUrl, description },
  })

  return NextResponse.json(
    { message: 'Create Successfully', museum },
    { status: 201 },
  )
}

//美術館を削除
export async function DELETE(req: NextRequest) {
  //URL:/api/rest/museums?id=1など
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const deleted = await prisma.museum.delete({
    where: { id: Number(id) },
  })

  return NextResponse.json(deleted)
}
