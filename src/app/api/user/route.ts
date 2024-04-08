import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { buildJsonResponse } from "@/utils"

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    // 获取url参数
    //  访问 /home, pathname 的值为 /home
    const pathname = request.nextUrl.pathname
    // 访问 /home?name=lee, searchParams 的值为 { 'name': 'lee' }
    const searchParams = request.nextUrl.searchParams
    let params: any = searchParams.get("params")??'{}'
    params = JSON.parse(params)
    const where = {
      name: {
        contains: params?.name || undefined,
      },
      email: {
        contains: params?.email || undefined,
      },
    }

    // 分页
    const page = searchParams.get("page") || 1
    const pageSize = searchParams.get("pageSize") || 20
    // console.log(page, pageSize, params, where)

    const [data, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        // 时间倒叙
        orderBy: {
          updatedAt: "desc",
        },
        // 查询条件
        where,
      }),
      prisma.user.count({
        where,
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

// post 新增
export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json()
  try {
    const data = await prisma.user.create({
      data: {
        ...body,
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
    const data = await prisma.user.delete({
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
  console.log("put body", body)
  if (!id) {
    return NextResponse.json(buildJsonResponse([], false, "id is required"))
  }
  try {
    await prisma.user.update({
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
