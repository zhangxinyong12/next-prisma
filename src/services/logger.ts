import winston, { format, level } from "winston"

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.prettyPrint()
  ),
  // defaultMeta: { service: "user-service" }, // 用于指定要自动添加到每条日志消息中的默认元数据。这意味着你可以为整个日志记录器实例设置一些共通的信息，这些信息将被包含在每一条日志中，无论日志的级别如何。
  transports: [
    // Info级别日志文件 (info.log): 这个文件用于记录所有info级别及以上（warn和error）的日志。由于info是一个相对较低的级别，这个文件将包含大部分的操作日志。
    new winston.transports.File({
      filename: "logs/info.log",
      level: "info",
      zippedArchive: true, // 压缩
      maxsize: 1024 * 1024 * 10, // 大小
      maxFiles: 5, // 最大文件数
    }),
    // Error级别日志文件 (error.log): 这个文件专门用于记录error级别的日志。在这个文件中，只会记录那些标识严重问题的日志消息。
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      zippedArchive: true, // 压缩 一旦日志文件达到配置的maxsize或是因为其他旋转条件而被轮换，winston将会自动将这些旧文件压缩为.gz格式，并保留在相同的目录下
      maxsize: 1024 * 1024 * 10, // 大小
      maxFiles: 5, // 最大文件数
    }),
  ],
})

export default logger
