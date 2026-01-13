import prisma from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const idStr = (await params).id
  const id = Number(idStr)
  const exhibition = await prisma.exhibition.findUnique({
    where: { id },
    include: { museum: true },
  })

  if (!exhibition)
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  return NextResponse.json(exhibition)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const idStr = (await params).id
  const id = Number(idStr)
  await prisma.exhibition.delete({ where: { id } })
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const idStr = (await params).id
    const id = Number(idStr)
    const body = await req.json()

    const { title, startDate, endDate, officialUrl, description, museumId } =
      body
    if (!title || !startDate || !endDate || !officialUrl || museumId == null) {
      return NextResponse.json(
        { error: 'name, address, URLを入力してください' },
        { status: 400 },
      )
    }

    const updateExhibition = await prisma.exhibition.update({
      where: { id },
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        officialUrl,
        description,
        museumId: Number(museumId),
      },
    })

    return NextResponse.json(updateExhibition)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {
        error: '更新できません',
      },
      { status: 500 },
    )
  }
}
