export const buildJsonResponse = (
  data: any,
  success = true,
  error?: string
) => {
  return {
    success,
    data,
    error: error || null,
  }
}
