import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

//展覧会一覧を取得
export async function GET() {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: {
      id: 'desc',
    },
    take: 5,
  })
  const formatted = exhibitions.map((ex) => ({
    ...ex,
    startDate: ex.startDate.getTime(), // ミリ秒
    endDate: ex.endDate.getTime(),
  }))

  return NextResponse.json(formatted)
}

//展覧会を登録
export async function POST(req: NextRequest) {
  const { title, startDate, endDate, officialUrl, description, museumId } =
    await req.json()
  if (!title || !startDate || !endDate || !officialUrl || museumId == null) {
    return NextResponse.json(
      {
        error: 'title, startDate, endDate, officialUrl, museumId are required',
      },
      { status: 400 },
    )
  }

  const exhibition = await prisma.exhibition.create({
    data: {
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      officialUrl,
      description,
      museumId: Number(museumId),
    },
  })

  return NextResponse.json(
    { message: 'Create Successfully', exhibition },
    { status: 201 },
  )
}
