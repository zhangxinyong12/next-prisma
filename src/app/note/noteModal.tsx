import { Form, Input, Modal } from "antd"
import { useEffect } from "react"

const { TextArea } = Input

type UserModalProps = {
  open: boolean
  data?: any
  onClose: () => void
  onOk: (data: any) => void
}

const NoteModal: React.FC<UserModalProps> = ({ open, data, onClose, onOk }) => {
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
      title={data?.id ? "编辑笔记" : "新增笔记"}
      onOk={onSubmit}
      onCancel={() => {
        onClose()
      }}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="authorId"
          label="用户id"
          rules={[
            {
              required: true,
              message: "请输入用户id",
            },
          ]}
        >
          <Input placeholder="请输入用户id" />
        </Form.Item>
        <Form.Item
          name="title"
          label="笔记名"
          rules={[
            {
              required: true,
              message: "请输入笔记名",
            },
          ]}
        >
          <Input placeholder="请输入笔记名" />
        </Form.Item>

        <Form.Item
          name="content"
          label="内容"
          rules={[
            {
              required: true,
              message: "请输入内容",
            },
          ]}
        >
          <TextArea placeholder="请输入内容" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NoteModal
