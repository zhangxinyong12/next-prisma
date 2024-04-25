"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  ProForm,
  ProFormInstance,
  ProFormText,
} from "@ant-design/pro-components"
import Link from "next/link"
import { Button, message } from "antd"
import { Fetch } from "@/utils/http"
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const router = useRouter()

  const formRef = useRef<ProFormInstance>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [btnStr, setBtnStr] = useState("登录")
  const timerID = useRef<NodeJS.Timeout>()
  useEffect(() => {
    if (btnStr === "登录中...") {
      timerID.current && clearTimeout(timerID.current)
      timerID.current = setTimeout(() => {
        setBtnStr("登录")
      }, 300)
    }
  }, [btnStr])

  const handleSubmit = async (values: any) => {
    // 处理登录逻辑，例如调用API
    console.log(values)
    // 根据你的需求进行调整
    setLoading(true)
    setBtnStr("登录中...")
    Fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((res) => {
        console.log(res)
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data.user))
        message.success("登录成功")
        setLoading(false)
        setBtnStr("登录成功")
        router.push("/user")
      })
      .catch((error) => {
        console.log("登录失败", error)
        setBtnStr("登录")
        setLoading(false)
        setError(error?.message || "登录失败")
      })
  }

  return (
    <div className="w-screen h-screen fixed z-50 top-0 left-0 bg-gray-50 ">
      <div className="flex item-center justify-center h-screen  w-screen mt-[-10vh]">
        <div className="w-[480px] p-8 shadow-lg m-auto  border border-gary-100 ">
          <h1 className="text-xl font-bold mb-4 text-center">登录</h1>
          <ProForm
            formRef={formRef}
            className="space-y-4"
            onFinish={handleSubmit}
            onValuesChange={() => {
              setError("")
            }}
            submitter={{
              render: (props, doms) => {
                return [
                  <div>
                    {error && (
                      <div className="text-sm text-red-500 mb-4">{error}</div>
                    )}
                    <Button
                      key="submit"
                      type="primary"
                      size="large"
                      className="w-full"
                      onClick={() => props.form?.submit?.()}
                      loading={loading}
                    >
                      {btnStr}
                    </Button>
                  </div>,
                ]
              },
            }}
          >
            <ProFormText
              name="name"
              label="用户名"
              placeholder="请输入用户名"
              rules={[{ required: true, message: "请输入用户名!" }]}
            />
            <ProFormText.Password
              name="password"
              label="密码"
              placeholder="请输入密码"
              rules={[{ required: true, message: "请输入密码!" }]}
            />
          </ProForm>
          <div className="flex justify-between mt-4">
            <Link href="/forgot-password">
              <span className="text-blue-500 hover:underline">忘记密码</span>
            </Link>
            <Link href="/register">
              <span className="text-blue-500 hover:underline">注册账户</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
