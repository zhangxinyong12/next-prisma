import prisma from "@/lib/prisma"
import { buildErrorJsonResponse, buildSuccessJsonResponse } from "@/utils"
import { encrypt } from "@/utils/crypto"
import { NextRequest } from "next/server"

// 注册
export async function POST(request: NextRequest) {
  const body = await request.json()

  // // 验证用户名是否存在
  const user = await prisma.user.findMany({
    where: {
      nickname: body.nickname,
    },
  })
  if (user.length > 0) {
    return buildErrorJsonResponse("用户名已存在")
  }
  const data = await prisma.user.create({
    data: {
      name: body.name,
      nickname: body.nickname,
      password: encrypt(body.password),
      email: body.email,
      age: +body.age,
      sex: +body.sex,
    },
  })
  return buildSuccessJsonResponse(data)
}
