"use client"

import MenuList from "@/app/(admin)/data/mune"
import { Menu, MenuProps } from "antd"
import { usePathname, useRouter } from "next/navigation"

export default function MyMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const selectedKeys = [pathname]

  function onClick(item: any) {
    router.push(item.key)
  }

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      mode="inline"
      items={MenuList}
      theme="light"
      selectedKeys={selectedKeys}
    />
  )
}
