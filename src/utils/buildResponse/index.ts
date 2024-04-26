import logger from "@/services/logger"
import { NextRequest } from "next/server"

/**
 * 请求成功的 response格式
 * @param data 数据体
 * @returns
 */
export const buildSuccessJsonResponse = (data: any) => {
  return Response.json({
    data,
    success: true,
    status: 200,
    message: "",
  })
}

/**
 * 请求失败的 response格式
 * @param message 错误信息
 * @param data 请求失败的data内容。默认是空
 * @param status 错误代码 默认500
 * @returns
 */
export const buildErrorJsonResponse = (
  message: string,
  data: any = "",
  status = 500,
  request?: NextRequest
) => {
  if (request) {
    logger.error(`请求失败: ${message}`, {
      url: request.url,
      method: request.method,
      headers: {
        "user-agent": request.headers.get("user-agent") || "",
        "content-type": request.headers.get("content-type") || "",
        token: request.headers.get("token") || "",
        origin: request.headers.get("origin") || "",
      },
    })
  }
  return Response.json({
    data: data,
    success: false,
    status: status,
    message,
  })
}

/**
 * 登录过期的401
 * @returns
 */
export const buildError401JsonResponse = () => {
  return buildErrorJsonResponse("登录过期", "", 401)
}
