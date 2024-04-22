# Stage 1: Building the code
FROM --platform=linux/amd64 docker.io/node:20-alpine AS builder

# 设置工作目录
WORKDIR /app
# 安装 libc6-compat 软件包,这是为了确保 Node.js 应用程序在 Alpine Linux 环境中正常运行
RUN apk add --update --no-cache libc6-compat 

RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm
# RUN npm install -g pnpm 
# 效果同上
RUN corepack enable 

# 设置pnpm仓库源
RUN pnpm config set registry https://registry.npmmirror.com

# 复制项目文件到工作目录
COPY . .

# 安装依赖 需要 pnpm-lock.yaml
RUN pnpm install --frozen-lockfile


# 安装Prisma CLI
RUN npm install -g prisma
# 生成Prisma客户端
RUN prisma generate

# 构建Next.js项目
RUN npm run build

# 安装清理依赖 
RUN pnpm install  clean-modules
# 清理依赖 会删除不必要的README.md 文件
RUN npx clean-modules -y

# 删除在 devDependencies 中指定的包
RUN pnpm prune --prod

# Stage 2: Run the application
FROM --platform=linux/amd64 docker.io/node:20-alpine

# 设置工作目录
WORKDIR /app
RUN apk add --update --no-cache libc6-compat 

# 复制构建结果到新的工作目录
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/prisma prisma


# 暴露端口
EXPOSE 3055

# 运行项目
CMD ["npm", "start"]