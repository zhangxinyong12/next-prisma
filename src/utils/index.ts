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

// 对数字进行处理，大于1000显示为1k ，大于10000显示为1w ，大于1000000显示为1m
export const formatNumber = (num: number) => {
  if (num > 10000) {
    return (num / 10000).toFixed(1) + "w"
  } else if (num > 1000) {
    return (num / 1000).toFixed(1) + "k"
  } else {
    return num
  }
}
