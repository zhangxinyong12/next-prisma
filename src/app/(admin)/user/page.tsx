"use client"

import {
  ActionType,
  ProColumns,
  ProFormInstance,
  ProTable,
  PageContainer,
} from "@ant-design/pro-components"
import dayjs from "dayjs"
import { useRef } from "react"
import { Fetch } from "@/utils/http"

const Page = () => {
  const actionRef = useRef<ActionType>()

  // 表格的form
  const tableForm = useRef<ProFormInstance>()
  const tableCloumns: ProColumns[] = [
    {
      title: "用户名",
      dataIndex: "name",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "年龄",
      dataIndex: "age",
      sort: true,
    },
    {
      title: "是否有效",
      dataIndex: "status",
      valueType: "select",
      hideInTable: true,
      fieldProps: {
        showSearch: true,
        options: [
          {
            label: "正常",
            value: 1,
          },
          {
            label: "禁用",
            value: 0,
          },
        ],
      },
    },
    {
      title: "创建日期",
      dataIndex: "createdAt",
      valueType: "dateTimeRange",
      align: "center",
    },
  ]
  async function onQuery(params = {}, sort, filter) {
    return Fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then(({ data }) => {
        console.log(data)
        return {
          data: data.items || [],
          success: true,
          total: data.total,
        }
      })
      .catch(() => {
        return {
          data: [],
          success: true,
          total: 0,
        }
      })
  }

  return (
    <PageContainer
      ghost
      header={{
        title: "用户列表",
      }}
    >
      <div>
        <ProTable
          className="myTable"
          rowKey="id"
          formRef={tableForm}
          columns={tableCloumns}
          actionRef={actionRef}
          request={onQuery}
          search={{
            labelWidth: 100,
            defaultCollapsed: false, // 默认全部展开
          }}
          toolBarRender={() => []}
        />
      </div>
    </PageContainer>
  )
}

export default Page
