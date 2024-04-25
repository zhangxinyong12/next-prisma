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

/**
 * 遍历对象，删除所有空字符串和undefined的属性并返回新的对象
 * @param values { [key: string]: any }
 * @returns { [key: string]: any }
 */
export function removeEmptyAndUndefined(values: { [key: string]: any }) {
  const filteredValues: { [key: string]: any } = {}
  for (const key in values) {
    if (values[key] !== "" && values[key] !== undefined) {
      filteredValues[key] = values[key]
    }
  }
  return filteredValues
}
