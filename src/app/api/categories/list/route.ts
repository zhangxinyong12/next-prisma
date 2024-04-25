import prisma from "@/lib/prisma"
import verify from "@/services/verifyToken"
import { removeEmptyAndUndefined } from "@/utils"
import {
  buildError401JsonResponse,
  buildErrorJsonResponse,
  buildSuccessJsonResponse,
} from "@/utils/buildResponse"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  if (!verify(request)) {
    return buildError401JsonResponse()
  }
  const body = await request.json()
  const { name, status, startDate, endDate } = removeEmptyAndUndefined(body)
  const where = {
    name: name ? { startsWith: name } : undefined,
    status: status === undefined ? undefined : status,
    updatedAt: {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    },
  }
  const current = Number(body.current | 1)
  const pageSize = Number(body.pageSize || 20)
  const [data, totalCount] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip: (current - 1) * pageSize,
      take: pageSize,
      include: {
        // 查询关联表 books 的数量
        _count: {
          select: {
            books: true,
          },
        },
      },
    }),
    prisma.category.count({
      where,
    }),
  ])
  // 把_count.books 改为 books
  data.forEach((item: any) => {
    item.books = item._count.books
    delete item._count
  })

  return buildSuccessJsonResponse({
    items: data,
    total: totalCount,
    pageSize,
    current,
  })
}
