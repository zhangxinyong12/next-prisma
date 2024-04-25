import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { buildError401JsonResponse } from "@/utils/buildResponse"

const secret = process.env.TOKEN_SECRET

/**
 * 解析headers里面的token
 * @param request NextRequest
 * @returns
 */
export default function verify(request: NextRequest) {
  // 获取请求头 token
  const token = request.headers.get("token") ?? ""
  try {
    const userData = jwt.verify(token, secret!)
    console.log(userData)
    return userData
  } catch (e) {
    console.error("校验token失败", e)
    return false
  }
}
