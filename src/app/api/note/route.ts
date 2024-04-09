import prisma from "@/lib/prisma"
import { buildJsonResponse } from "@/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const searchParams = request.nextUrl.searchParams
    let params: any = searchParams.get("params") ?? "{}"
    params = params ? JSON.parse(params === "undefined" ? "{}" : params) : {}
    const wherre = {
      title: params?.title || undefined,
      content: params?.content || undefined,
    }
    const page = searchParams.get("page") || 1
    const pageSize = searchParams.get("pageSize") || 10
    const [data, totalCount] = await Promise.all([
      prisma.note.findMany({
        skip: Number(+page - 1) * Number(pageSize),
        take: +pageSize,
        orderBy: {
          updatedAt: "desc",
        },
        where: wherre,
        include: {
          // author: true, // 在这里指定要包括作者的全部信息
          author: {
            // 在这里指定要包括作者的部分信息
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.note.count({
        where: wherre,
      }),
    ])
    return NextResponse.json(
      buildJsonResponse({
        items: data,
        total: totalCount,
        page: Number(page),
        pageSize: Number(pageSize),
      })
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(buildJsonResponse([], false, error as any))
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json()
  console.log(body)
  // 先判断authorId 在不在
  const userData = await prisma.user.findUnique({
    where: {
      id: +body.authorId,
    },
  })
  if (!userData) {
    return NextResponse.json(buildJsonResponse([], false, "用户不存在"))
  }
  try {
    const data = await prisma.note.create({
      data: {
        ...body,
        authorId: +body.authorId,
      },
    })
    return NextResponse.json(buildJsonResponse(data))
  } catch (error: any) {
    return NextResponse.json(buildJsonResponse([], false, error))
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const id = request.nextUrl.searchParams.get("id")
  try {
    const data = await prisma.note.delete({
      where: {
        id: Number(id),
      },
    })
    return NextResponse.json(buildJsonResponse(data))
  } catch (e) {
    return NextResponse.json(buildJsonResponse([], false, e as any))
  }
}

export async function PUT(request: NextRequest, response: NextResponse) {
  const body = await request.json()
  const id = body?.id
  if (!id) {
    return NextResponse.json(buildJsonResponse([], false, "id is required"))
  }
  try {
    await prisma.note.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    })
    return NextResponse.json(buildJsonResponse(body, true))
  } catch (e) {
    return NextResponse.json(buildJsonResponse([], false, e as any))
  }
}
