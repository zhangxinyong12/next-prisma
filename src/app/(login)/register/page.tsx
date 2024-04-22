"use client"

import React, { useRef } from "react"
import {
  ProForm,
  ProFormInstance,
  ProFormText,
  PageContainer,
  ProFormRadio,
} from "@ant-design/pro-components"
import { Button } from "antd"
import { useRouter } from "next/navigation"
import { Fetch } from "@/utils/http"

const RegisterPage = () => {
  const formRef = useRef<ProFormInstance>()

  const router = useRouter()

  const handleSubmit = async (values: any) => {
    const params = { ...values }
    delete params.password2
    await Fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => {
        console.log("注册成功:", res)
        // 注册成功后,可以跳转到登录页面或其他页面
        router.push("/login")
      })
      .catch((error) => {
        console.log("注册失败:", error)
      })
  }

  return (
    <PageContainer>
      <div className="w-[480px]  m-auto mt-10">
        <ProForm
          formRef={formRef}
          onFinish={handleSubmit}
          submitter={{
            render: (props, doms) => {
              return [
                <Button key="reset" onClick={() => props.form?.resetFields?.()}>
                  重置
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => props.form?.submit?.()}
                >
                  注册
                </Button>,
              ]
            },
          }}
        >
          <ProFormText
            name="name"
            label="真实名称"
            placeholder="请输入真实名称"
            rules={[{ required: true, message: "请输入真实名称!" }]}
          />

          <ProFormText
            name="nickname"
            label="昵称"
            placeholder="请输入昵称"
            rules={[{ required: true, message: "请输入昵称!" }]}
          />
          <ProFormText
            name="age"
            label="年龄"
            placeholder="请输入年龄"
            rules={[{ required: true, message: "请输入年龄!" }]}
          />

          <ProFormRadio.Group
            name="sex"
            label="性别"
            rules={[{ required: true, message: "请选择性别!" }]}
            options={[
              {
                label: "男",
                value: "1",
              },
              {
                label: "女",
                value: "2",
              },
              {
                label: "保密",
                value: "-1",
              },
            ]}
          />

          <ProFormText
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              { required: true, message: "请输入邮箱!" },
              { type: "email", message: "请输入有效的邮箱地址!" },
            ]}
          />
          <ProFormText.Password
            name="password"
            label="密码"
            placeholder="请输入密码"
            rules={[{ required: true, message: "请输入密码!" }]}
          />
          <ProFormText.Password
            name="password2"
            label="确认密码"
            placeholder="请输入密码"
            rules={[
              { required: true, message: "请输入密码!" },
              // 校验2次密码是否一样
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("两次输入的密码不一致!"))
                },
              }),
            ]}
          />
        </ProForm>
      </div>
    </PageContainer>
  )
}

export default RegisterPage
