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
  status = 500
) => {
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
