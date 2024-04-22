import crypto from "crypto"

const algorithm = "aes-256-cbc" // 加密算法
const secretKey = "Lm9qN3pX6rT6wHv8Qf2yBn4sDk8zCt7u" // 密钥key
const iv = Buffer.from("1b027de5a4f997ca0daace019912b769", "hex") // 偏移量

/**
 * 加密
 * @param text string
 * @returns  string
 */
export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return encrypted.toString("hex")
}

/**
 * 解密
 * @param content string
 * @returns string
 */
export const decrypt = (content: string) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ])

  return decrpyted.toString()
}
