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
    // 分页
    const page = searchParams.get("page") || 1
    const pageSize = searchParams.get("pageSize") || 20
    const [data, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
      }),
      prisma.user.count(),
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
    return NextResponse.json(buildJsonResponse([], false, "查询失败"))
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
