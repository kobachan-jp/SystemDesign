import prisma from '@/app/lib/prisma'
import { error } from 'console'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const idStr = (await params).id
  const id = Number(idStr)
  const museum = await prisma.museum.findUnique({
    where: { id },
    include: { exhibitions: true },
  })

  if (!museum) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  return NextResponse.json(museum)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const idStr = (await params).id
  const id = Number(idStr)
  await prisma.museum.delete({ where: { id } })
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
}
