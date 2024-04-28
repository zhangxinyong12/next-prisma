import prisma from "@/lib/prisma"
import { encrypt } from "@/utils/crypto"
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import {
  buildErrorJsonResponse,
  buildSuccessJsonResponse,
} from "@/utils/buildResponse"
import { log } from "console"
import logger from "@/services/logger"
const secret = process.env.TOKEN_SECRET
export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.name || !body.password) {
    return buildErrorJsonResponse("用户名或密码不能为空")
  }
  // 验证用户名是否存在
  const user = await prisma.user.findUnique({
    where: {
      name: body.name,
    },
  })
  if (!user) {
    return buildErrorJsonResponse("用户名不存在")
  }
  // 用户名和密码
  const userData = await prisma.user.findUnique({
    where: {
      name: body.name,
      password: encrypt(body.password),
    },
  })
  console.log(userData, body, user)
  if (!userData) {
    return buildErrorJsonResponse("用户名和密码不匹配")
  }
  const token = jwt.sign(userData, secret!, { expiresIn: "30d" })
  // 记录一下登录日志
  logger.info(`用户登录: ${userData.name}`, {
    name: userData.name,
    id: userData.id,
  })
  return buildSuccessJsonResponse({
    user: userData,
    token,
  })
}
