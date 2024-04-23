import prisma from "@/lib/prisma"
import {
  buildErrorJsonResponse,
  buildSuccessJsonResponse,
  removeEmptyAndUndefined,
} from "@/utils"
import { encrypt } from "@/utils/crypto"
import { NextRequest } from "next/server"

import jwt from "jsonwebtoken"
const secret = process.env.TOKEN_SECRET

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log(body)
  const { name, nickname, email, age } = removeEmptyAndUndefined(body)
  const where = {
    name: name ? { startsWith: name } : undefined,
    nickname: nickname ? { startsWith: nickname } : undefined,
    email: email ? { startsWith: email } : undefined,
    age,
  }
  const current = Number(body.current | 1)
  const pageSize = Number(body.pageSize || 20)
  const [data, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip: (current - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({
      where,
    }),
  ])

  return buildSuccessJsonResponse({
    items: data,
    total: totalCount,
    pageSize,
    current,
  })
}
