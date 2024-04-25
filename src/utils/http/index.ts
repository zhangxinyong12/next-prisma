import { message } from "antd"

// 创建一个标志以跟踪认证错误是否已经显示过
let isAuthErrorShown = false
const LoginURL = "/login"

export async function Fetch(
  url: string,
  options?: RequestInit & { notShowError?: boolean }
): Promise<{
  data: any // 请求的数据
  success: boolean // 是否成功
  message: string // 失败的错误信息
  statues: boolean // 响应状态
}> {
  const token = localStorage.getItem("token")
  // if (!token) {
  //   window.location.href = LoginURL
  //   return Promise.reject("未登录")
  // }

  const notShowError = options?.notShowError
  const newOptions = {
    ...options,
    headers: {
      token: token ?? "",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  }

  return fetch(url, newOptions)
    .then((res: any) => {
      return res.json()
    })
    .then((res) => {
      // 401 未登录
      if (res.status === 401) {
        // 检查是否已经显示过登录过期的弹窗
        if (!isAuthErrorShown) {
          message.error("登录过期,请重新登录")
          // 记录当前的url
          console.log("http 401 redirect url ", window.location.href)
          // 清空local
          localStorage.clear()
          sessionStorage.setItem("redirectUrl", window.location.href)

          window.location.href = LoginURL
          // 设置标志为true，以避免再次显示弹窗
          isAuthErrorShown = true
        }
        // 直接抛出一个错误，不再进行后续处理
        throw new Error("Unauthorized")
      }
      if (!res.success) {
        const msg = res.message || "请求失败"
        !notShowError && message.error(msg)
        return Promise.reject(res)
      }
      return Promise.resolve(res)
    })
    .catch((err) => {
      // 在这里处理其它错误
      return Promise.reject(err)
    })
}
