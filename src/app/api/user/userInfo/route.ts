import verify from "@/services/verifyToken"
import {
  buildError401JsonResponse,
  buildSuccessJsonResponse,
} from "@/utils/buildResponse"

import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const userData = await verify(request)
  if (!userData) {
    return buildError401JsonResponse()
  }

  return buildSuccessJsonResponse(userData)
}
