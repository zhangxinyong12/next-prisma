import { NextRequest, NextResponse } from "next/server"
import logger from "./services/logger"

// TODO 中间件不支持nodejs运行环境。必须是edge runtime，也就是说必须是vercel部署。
// 也能运行。但是没有node环境。也就说不能全部调用nodejs api。部分api会报错
export function middleware(request: NextRequest, response: NextResponse) {
  console.log("中间件执行", request.url)
  // // 记录日志
  // logger.info(`请求: ${request.url}`, {
  //   url: request.url,
  //   method: request.method,
  //   headers: {
  //     "user-agent": request.headers.get("user-agent") || "",
  //     "content-type": request.headers.get("content-type") || "",
  //     token: request.headers.get("token") || "",
  //     origin: request.headers.get("origin") || "",
  //   },
  // })
  return NextResponse.next()
}
