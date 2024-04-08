"use client"
import {
  Table,
  TableProps,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Button,
  GetProp,
} from "antd"
import { useEffect, useState } from "react"
import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons"
const { TextArea } = Input

type UserModalProps = {
  open: boolean
  data?: any
  onClose: () => void
  onOk: (data: any) => void
}

const UserModal: React.FC<UserModalProps> = ({ open, data, onClose, onOk }) => {
  const [form] = Form.useForm()
  function onSubmit() {
    form.validateFields().then((values) => {
      onOk(values)
    })
  }
  return (
    <Modal
      open={open}
      title={data?.id ? "编辑用户" : "新增用户"}
      onOk={onSubmit}
      onCancel={() => {
        onClose()
      }}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="name"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              required: true,
              message: "请输入邮箱",
            },
          ]}
        >
          <Input placeholder="请输入邮箱" type="email" />
        </Form.Item>
        <Form.Item
          name="desc"
          label="备注"
          rules={[
            {
              required: true,
              message: "请输入备注",
            },
          ]}
        >
          <TextArea placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

type ColumnsType<T> = TableProps<T>["columns"]
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, "onChange">>[1]
}
const Page = () => {
  const [data, setData] = useState([])

  const columns: TableProps["columns"] = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
    },
    {
      title: "desc",
      dataIndex: "desc",
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ]
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  })
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalData, setModalData] = useState<any>()
  function onOk(data: any) {
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      setOpenModal(false)
      refresh()
    })
  }

  function onClose() {
    setOpenModal(false)
  }

  function refresh() {
    getData()
  }

  function getData(refresh: boolean = false) {
    setLoading(true)
    const params = {
      page: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
    }
    fetch("/api/user?" + new URLSearchParams(params as any).toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        console.log(data)
        setData(data.items)

        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.total,
          },
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const handleTableChange: TableProps["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    })
  }

  useEffect(() => {
    getData()
  }, [tableParams?.pagination?.current, tableParams?.pagination?.pageSize])

  return (
    <div className="p-2">
      <div>
        <div className="mb-4 flex item-center justify-between">
          <Button
            type="primary"
            onClick={() => {
              setOpenModal(true)
              setModalData(undefined)
            }}
          >
            <PlusOutlined />
            新增用户
          </Button>
          <Button
            onClick={() => {
              refresh()
            }}
          >
            刷新
          </Button>
        </div>
        <Table
          rowKey={"id"}
          scroll={{
            x: "max-content",
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </div>
      <UserModal
        open={openModal}
        data={modalData}
        onOk={onOk}
        onClose={onClose}
      />
    </div>
  )
}

export default Page
