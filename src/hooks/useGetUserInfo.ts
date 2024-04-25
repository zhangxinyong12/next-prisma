import { Fetch } from "@/utils/http"
import { useEffect, useState } from "react"

export default function useGetUserInfo() {
  const [userData, setUserData] = useState<any>({})
  useEffect(() => {
    Fetch("/api/user/userInfo").then((res) => {
      console.log(res)
      setUserData(res.data)
    })
  }, [])
  return {
    userData,
  }
}
