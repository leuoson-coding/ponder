# Ponder Authentication Extension 实现文档

## 项目概述

Ponder Authentication Extension 是为 Ponder IDE 开发的认证扩展，提供统一的用户登录体验。该扩展实现了完整的 OAuth 2.0 认证流程，支持安全的会话管理和多账户登录。

## 核心功能

### 1. 认证提供者 (AuthProvider)

**文件**: `src/authProvider.ts`

- 实现 VSCode `AuthenticationProvider` 接口
- 支持 OAuth 2.0 授权码流程
- 安全的会话存储和管理
- 自动处理令牌刷新
- 支持多账户登录

**主要方法**:
- `getSessions()`: 获取现有认证会话
- `createSession()`: 创建新的认证会话
- `removeSession()`: 移除认证会话

### 2. 扩展主入口 (Extension)

**文件**: `src/extension.ts`

- 扩展激活和停用逻辑
- 注册认证提供者
- 注册用户命令
- 状态栏集成
- 事件监听和处理

**注册的命令**:
- `ponder-authentication.login`: 登录到 Ponder 服务
- `ponder-authentication.logout`: 退出登录
- `ponder-authentication.getUserInfo`: 获取用户信息

### 3. 遥测报告 (Telemetry)

**文件**: `src/telemetryReporter.ts`

- 收集用户使用数据
- 错误和性能监控
- 隐私保护的数据收集

**事件类型**:
- 登录尝试事件
- 登录成功事件
- 登录失败事件
- 登出事件

### 4. 日志记录 (Logger)

**文件**: `src/logger.ts`

- 统一的日志记录接口
- 多级别日志支持
- 调试和问题排查支持

## 技术架构

### 认证流程

1. **授权请求**: 用户点击登录，扩展生成授权URL
2. **浏览器授权**: 自动打开浏览器，用户完成登录
3. **回调处理**: 通过 URI Handler 接收授权码
4. **令牌交换**: 使用授权码交换访问令牌
5. **会话创建**: 创建并存储认证会话
6. **状态更新**: 更新UI状态，通知其他组件

### 安全特性

- **安全存储**: 使用 VSCode SecretStorage API 存储敏感信息
- **HTTPS 通信**: 所有网络请求使用 HTTPS 加密
- **令牌过期**: 自动处理令牌过期和刷新
- **会话隔离**: 不同账户的会话相互隔离

### 配置选项

- `ponder-authentication.serverUrl`: Ponder 服务器地址

## 构建和部署

### 开发环境设置

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run compile

# 启动监听模式
npm run watch

# 运行测试
npm test

# 代码检查
npm run lint
```

### 生产构建

```bash
# 生产构建
npm run package

# 生成的文件在 dist/ 目录
```

### 调试

1. 在 VSCode 中打开项目
2. 按 F5 启动调试会话
3. 在新的 VSCode 窗口中测试功能

## 集成到 Ponder IDE

### 构建系统集成

1. **gulpfile.extensions.js**: 添加到编译任务列表
2. **product.json**: 添加到内置扩展列表

### 依赖关系

- VSCode API: ^1.42.0
- Node.js: >=16.0.0
- TypeScript: ^5.0.0

## API 接口

### 后端 API 要求

扩展需要后端提供以下 API 端点：

1. **GET /api/vscode/authorize**
   - 获取授权URL和状态参数
   - 参数: redirect_uri, scope

2. **POST /api/vscode/callback**
   - 交换访问令牌
   - 参数: code, state, redirect_uri

3. **GET /api/vscode/user**
   - 获取用户信息
   - 需要 Authorization header

## 测试

### 单元测试

- 扩展激活测试
- 认证提供者注册测试
- 命令注册测试

### 集成测试

- 完整认证流程测试
- 会话管理测试
- 错误处理测试

## 未来改进

1. **令牌自动刷新**: 实现访问令牌的自动刷新机制
2. **离线支持**: 支持离线模式下的基本功能
3. **多语言支持**: 添加国际化支持
4. **高级配置**: 更多的配置选项和自定义设置
5. **性能优化**: 优化启动时间和内存使用

## 故障排除

### 常见问题

1. **登录失败**: 检查服务器URL配置和网络连接
2. **会话丢失**: 检查 VSCode 的安全存储权限
3. **命令不可用**: 确认扩展已正确激活

### 调试技巧

1. 查看输出面板的 "Ponder Authentication" 日志
2. 使用 VSCode 开发者工具检查网络请求
3. 检查扩展的激活状态和注册信息

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支
3. 提交代码更改
4. 运行测试确保质量
5. 提交 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件
