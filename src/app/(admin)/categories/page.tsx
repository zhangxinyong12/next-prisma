"use client"

import {
  ActionType,
  ProColumns,
  ProTable,
  ProForm,
  ProFormInstance,
  ProFormText,
  PageContainer,
  ProFormRadio,
  ModalForm,
} from "@ant-design/pro-components"
import { Button, Form, message } from "antd"

import dayjs from "dayjs"
import { useRef } from "react"
import { Fetch } from "@/utils/http"
import { PlusOutlined } from "@ant-design/icons"

const Page = () => {
  const actionRef = useRef<ActionType>()

  // 表格的form
  const tableForm = useRef<ProFormInstance>()
  const tableCloumns: ProColumns[] = [
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "书籍数量",
      dataIndex: "nickname",
    },
    {
      title: "是否有效",
      dataIndex: "status",
      valueType: "select",
      hideInTable: true,
    },
    {
      title: "是否有效",
      dataIndex: "status",
      hideInSearch: true,
      align: "center",
      renderText(text, record, index, action) {
        return text === 1 ? (
          <span className="text-green-500">有效</span>
        ) : text === 0 ? (
          <span className="text-red-500">无效</span>
        ) : (
          <span className="text-gary-500">未知</span>
        )
      },
    },
    {
      title: "创建日期",
      dataIndex: "createdAt",
      valueType: "dateTimeRange",
      hideInTable: true,
    },
    {
      title: "创建日期",
      dataIndex: "createdAt",
      hideInSearch: true,
      align: "center",
      renderText(text, record, index, action) {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss")
      },
    },
  ]
  async function onQuery(params = {}, sort = {}, filter = {}) {
    return Fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        ...params,
        sort,
        filter,
      }),
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
  const [form] = Form.useForm()
  const AddModal = () => (
    <ModalForm
      title="新增"
      trigger={
        <Button type="primary">
          <div className="flex items-center gap-4">
            <PlusOutlined />
            新增
          </div>
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log("run"),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values.name)
        message.success("提交成功")
        return true
      }}
    >
      <ProFormText
        width="md"
        name="name"
        label="类别名称"
        placeholder="请输入名称"
      />
    </ModalForm>
  )

  return (
    <PageContainer
      ghost
      header={{
        title: "书籍列表",
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
          toolBarRender={() => [<AddModal key="add" />]}
        />
      </div>
    </PageContainer>
  )
}

export default Page
