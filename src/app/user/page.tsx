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
  message,
  Row,
  Col,
} from "antd"
import { useEffect, useState } from "react"
import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
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

  useEffect(() => {
    if (open && data?.id) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }, [open, data])

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
  params?: any
}
const { confirm } = Modal
const Page = () => {
  const [data, setData] = useState([])

  const columns: TableProps["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "name",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      render: (text: string) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss")
      },
    },
    {
      title: "修改时间",
      dataIndex: "updatedAt",
      render: (text: string) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss")
      },
    },
    {
      title: "备注",
      dataIndex: "desc",
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            onClick={() => handleDelete(record.id, record.name)}
          >
            删除
          </Button>
          <Button size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
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
    params: {},
  })
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalData, setModalData] = useState<any>()

  function handleDelete(id: number, name: string) {
    // 删除二次确认
    confirm({
      title: (
        <div>
          <span>
            确定删除
            <span className="text-red-600 font-bold">{name}</span>吗
          </span>
        </div>
      ),
      onOk() {
        fetch(`/api/user?id=${id}`, {
          method: "DELETE",
        }).then(() => {
          message.success("删除成功")
          refresh()
        })
      },
    })
  }

  function handleEdit(item: any) {
    setModalData(item)
    setOpenModal(true)
  }

  function onOk(item: any) {
    if (!modalData?.id) {
      add(item)
    } else {
      update(item)
    }
  }

  function add(item: any) {
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(item),
    }).then((res) => {
      setOpenModal(false)
      refresh()
    })
  }

  function update(item: any) {
    fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify({ ...item, id: modalData?.id }),
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
      params: JSON.stringify(tableParams?.params),
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
        if (data.items.length === 0 && data.total > 0) {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams?.pagination,
              current: 1,
              pageSize: data.pageSize,
              total: data.total,
            },
          })
        } else {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: data.total,
            },
          })
        }
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
    setTableParams(() => ({
      ...tableParams.params,
      pagination,
      filters,
      ...sorter,
    }))
  }

  useEffect(() => {
    getData()
  }, [
    tableParams?.pagination?.current,
    tableParams?.pagination?.pageSize,
    tableParams?.params,
  ])

  const [form] = Form.useForm()

  function onReset() {
    form.resetFields()
    setTableParams(() => ({
      ...tableParams,
      params: {},
    }))
  }

  function onSearch() {
    form.validateFields().then((values) => {
      setTableParams(() => ({
        ...tableParams,
        params: values,
      }))
    })
  }

  return (
    <div className="p-2">
      <div>
        <div className="mt-4 p-2">
          <Form form={form}>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="用户名" name="name">
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="邮箱" name="email">
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <div>
                  <Button onClick={onReset}>重置</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="ml-4"
                    onClick={onSearch}
                  >
                    查询
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="my-4 w-full flex item-center justify-end">
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
