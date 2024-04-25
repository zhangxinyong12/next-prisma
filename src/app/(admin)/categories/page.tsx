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
  ProFormSwitch,
} from "@ant-design/pro-components"
import { Button, Form, Popconfirm, Switch, message } from "antd"

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
      dataIndex: "books",
      align: "right",
      hideInSearch: true,
    },
    {
      title: "是否有效",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        0: { text: "无效" },
        1: { text: "有效" },
      },
      hideInTable: true,
    },
    {
      title: "是否有效",
      dataIndex: "status",
      hideInSearch: true,
      align: "center",
      renderText(text, record, index, action) {
        return (
          <Switch
            checked={text === 1}
            checkedChildren="有效"
            unCheckedChildren="无效"
            onChange={() => {
              changeStatusHandle({
                id: record.id,
                status: text === 1 ? 0 : 1,
              })
            }}
          />
        )
      },
    },
    {
      title: "创建日期",
      dataIndex: "createdAt",
      valueType: "dateRange",
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
    {
      title: "操作",
      valueType: "option",
      render: (text, record, _, action) => [
        <Popconfirm
          key="delete"
          title="提示"
          description="确定要删除吗?"
          onConfirm={() => {
            deleteHandle(record.id)
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  // 删除 二次弹窗
  function deleteHandle(id: string) {
    Fetch("/api/categories", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }).then(() => {
      message.success("删除成功")
      actionRef.current?.reload()
    })
  }

  // 切换状态
  function changeStatusHandle(item: { id: string; status: number }) {
    Fetch("/api/categories", {
      method: "PUT",
      body: JSON.stringify(item),
    }).then(() => {
      message.success("状态修改成功")
      actionRef.current?.reload()
    })
  }

  // 分页查询
  async function onQuery(_params = {}, sort = {}, filter = {}) {
    const params: any = { ..._params }
    // createdAt ['','']
    if (params.createdAt && params.createdAt.length === 2) {
      params.startDate = params.createdAt[0]
      params.endDate = params.createdAt[1]
      delete params.createdAt
    }
    return Fetch("/api/categories/list", {
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
        return Fetch("/api/categories", {
          method: "POST",
          body: JSON.stringify(values),
        }).then(() => {
          message.success("提交成功")
          actionRef.current?.reload()
          // 关闭弹窗
          form.resetFields()
          return true
        })
      }}
      initialValues={{
        status: 1,
      }}
    >
      <ProFormText
        width="md"
        name="name"
        label="类别名称"
        placeholder="请输入名称"
        rules={[
          {
            required: true,
            message: "清输入类名名称",
          },
        ]}
      />
      {/* 状态switch */}
      <ProFormSwitch
        name="status"
        label="是否有效"
        checkedChildren="有效"
        unCheckedChildren="无效"
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
