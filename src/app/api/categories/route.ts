import prisma from "@/lib/prisma"
import verify from "@/services/verifyToken"
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
  // 先判断name 是否存在
  const name = body.name as string
  if (!name) {
    return buildErrorJsonResponse("name不能为空")
  }
  // 通过name查询数据
  const data = await prisma.category.findUnique({
    where: {
      name,
    },
  })
  if (data) {
    return buildErrorJsonResponse(`${name}已存在`)
  }
  // 创建数据
  const result = await prisma.category.create({
    data: {
      name,
      status: +body.status,
    },
  })
  return buildSuccessJsonResponse(result)
}

// 修改
export async function PUT(request: NextRequest) {
  try {
    if (!verify(request)) {
      return buildError401JsonResponse()
    }
    const body = await request.json()
    const id = body.id
    // 先判断id是否存在
    const isData = await prisma.category.findUnique({
      where: {
        id,
      },
    })
    if (!isData) {
      return buildErrorJsonResponse(`id:${id}不存在`)
    }
    const data = await prisma.category.update({
      where: {
        id,
      },
      data: {
        status: +body.status,
      },
    })
    return buildSuccessJsonResponse(data)
  } catch (error: any) {
    // error
    return buildErrorJsonResponse(error?.message as any, "", 500, request)
  }
}

// 删除
export async function DELETE(request: NextRequest) {
  if (!verify(request)) {
    return buildError401JsonResponse()
  }
  const body = await request.json()
  const id = +body.id
  // 先判断id是否存在
  const isData = await prisma.category.findUnique({
    where: {
      id,
    },
  })
  if (!isData) {
    return buildErrorJsonResponse(`id:${id}不存在`)
  }
  const data = await prisma.category.delete({
    where: {
      id,
    },
  })
  return buildSuccessJsonResponse(data)
}
