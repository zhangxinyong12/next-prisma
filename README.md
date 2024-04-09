This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## .env
.env文件不在，需要手动添加你的mysql数据库
```
DATABASE_URL="mysql://xx:xxx@xxxx:3306/xxx"
```
初始化数据库
```
npx prisma generate
```


## prisma
在Next.js中使用Prisma的步骤大致如下：

### 1. 安装Prisma CLI

首先，你需要在你的Next.js项目中安装Prisma CLI。你可以通过npm或yarn来安装。

```bash
npm install prisma --save-dev
# 或者
yarn add prisma --dev
```

### 2. 初始化Prisma

接着，初始化Prisma以生成Prisma配置文件。

```bash
npx prisma init
```

这将创建一个`prisma`文件夹，里面含有一个`schema.prisma`文件，用于定义你的数据模型，以及一个`.env`文件，用于存放数据库连接信息。

### 3. 配置数据库连接

在`.env`文件中配置你的数据库连接字符串。例如，如果你使用的是PostgreSQL，你的配置可能看起来像这样：

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

请确保将`USER`, `PASSWORD`, `HOST`, `PORT`, 和 `DATABASE`替换成你自己的数据库信息。

### 4. 定义数据模型

在`schema.prisma`文件中定义你的数据模型。例如，如果你想创建一个`User`表，你可以这样定义：

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5. 生成Prisma客户端

运行下面的命令来生成Prisma客户端。这将根据你的数据模型生成一个Prisma客户端，你可以在你的Next.js应用中使用它来进行数据库操作。

```bash
npx prisma generate
```

### 6. 使用Prisma客户端

现在你可以在你的Next.js应用中使用Prisma客户端了。首先，你需要导入Prisma客户端：

```javascript
import { PrismaClient } from '@prisma/client'
```

然后，实例化Prisma客户端：

```javascript
const prisma = new PrismaClient()
```

最后，你就可以使用Prisma客户端来进行数据库操作了。例如，创建一个新用户：

```javascript
async function createUser(name, email) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  })
  return user
}
```

这些步骤提供了在Next.js项目中使用Prisma的基本指南。根据你的具体需求，你可能还需要查阅Prisma的官方文档来了解更多高级特性和最佳实践。

在根目录运行 ```npx prisma studio```，它会打开一个网页：

你可以在这个页面查看和编辑数据库中的数据。

#### 模型和数据库同步
1. 本地模型同步远程数据库
```
npx prisma migrate dev
```
2. 远程数据库同步本地模型
```
npm prisma db pull
```
Prisma 会自动在 prisma/schema.prisma 中同步字段

以上1，2，都需要
```
npx prisma generate
```