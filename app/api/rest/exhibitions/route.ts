import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

//展覧会一覧を取得
export async function GET() {
  const exhibitions = await prisma.exhibitions.findMany()
  return NextResponse.json(exhibitions)
}

//展覧会を登録
export async function POST(req: NextRequest) {
  const { title, startDate, endDate, officialUrl, description, museumId } =
    await req.json()
  if (!title || !startDate || !endDate || !officialUrl || !museumId) {
    return NextResponse.json(
      {
        error: 'title, startDate, endDate, officialUrl, museumId are required',
      },
      { status: 400 },
    )
  }

  const exhibition = await prisma.exhibition.create({
    data: { title, startDate, endDate, officialUrl, description, museumId },
  })

  return NextResponse.json(
    { message: 'Create Successfully', exhibition },
    { status: 201 },
  )
}

//展覧会を削除
export async function DELETE(req: NextRequest) {
  //URL:/api/rest/exhibitions/${id}など
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const deleted = await prisma.exhibitions.delete({
    where: { id: Number(id) },
  })

  return NextResponse.json(deleted)
}
