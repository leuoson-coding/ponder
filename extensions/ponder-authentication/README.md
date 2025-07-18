# Ponder Authentication Extension

Ponder IDE 的认证扩展，为用户提供统一的登录体验。

## 功能特性

- **OAuth 2.0 认证流程**：支持标准的 OAuth 2.0 授权码流程
- **安全会话管理**：使用 VSCode 的安全存储机制保存认证令牌
- **多账户支持**：支持同时登录多个 Ponder 账户
- **自动令牌刷新**：自动处理访问令牌的刷新
- **状态栏集成**：在状态栏显示登录状态
- **命令面板支持**：通过命令面板快速执行认证操作

## 使用方法

### 登录

1. 点击状态栏右侧的 "Ponder" 按钮
2. 或者使用命令面板 (Ctrl+Shift+P) 搜索 "Ponder: 登录到 Ponder 服务"
3. 浏览器会自动打开，完成登录授权
4. 授权成功后会自动返回到 VSCode

### 登出

1. 使用命令面板 (Ctrl+Shift+P) 搜索 "Ponder: 退出登录"
2. 确认退出登录

### 查看用户信息

1. 登录后，点击状态栏的用户名
2. 或者使用命令面板搜索相关命令

## 配置选项

- `ponder-authentication.serverUrl`: Ponder 服务器地址（默认：https://api.ponder.com）

## 开发

### 构建

```bash
npm install
npm run compile
```

### 调试

1. 在 VSCode 中打开此项目
2. 按 F5 启动调试会话
3. 在新的 VSCode 窗口中测试扩展功能

## 许可证

MIT License
