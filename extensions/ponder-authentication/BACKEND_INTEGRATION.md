# 🔗 Ponder 认证扩展后端集成指南

## ✅ 当前状态

- **扩展配置** ✅ - 已更新为使用 `http://localhost:3001`
- **服务器连接** ✅ - 后端服务器正在运行
- **API 端点** ⚠️ - 部分端点可用，回调端点返回 200

## 🔧 已完成的配置更新

### 1. 服务器地址配置
```json
"ponder-authentication.serverUrl": {
  "default": "http://localhost:3001"
}
```

### 2. 授权服务器 Glob 模式
```json
"authorizationServerGlobs": [
  "http://localhost:3001/vscode/*"
]
```

### 3. API 调用更新
- 登录页面：`GET /vscode/auth?redirect_uri=...&scope=...&state=...`
- 回调端点：`POST /vscode/auth/callback`
- 用户信息：`GET /vscode/auth/user`

## 📋 后端 API 需要实现的接口

### 1. GET /vscode/auth (登录页面)
**参数：**
- `redirect_uri`: VSCode 回调 URI
- `scope`: 权限范围（如 "user"）
- `state`: 状态参数

**响应：**
- 返回 HTML 登录页面
- 页面包含登录表单或 GitHub 登录按钮
- 用户完成登录后重定向到 `redirect_uri`

### 2. POST /vscode/auth/callback
**请求体：**
```json
{
  "code": "authorization_code",
  "state": "state_from_authorize",
  "redirect_uri": "vscode://ponder.ponder-authentication/auth-complete"
}
```

**响应：**
```json
{
  "access_token": "github_access_token",
  "account": {
    "id": "user_id",
    "label": "username"
  }
}
```

### 3. GET /vscode/auth/user
**请求头：**
```
Authorization: Bearer <access_token>
```

**响应：**
```json
{
  "username": "user_name",
  "email": "user@example.com",
  "id": "user_id"
}
```

## 🚀 测试步骤

### 1. 确保后端 API 实现
确保上述三个端点在后端正确实现并返回预期的响应格式。

### 2. 测试扩展
1. 在 VSCode 中打开 `extensions/ponder-authentication`
2. 按 F5 启动调试会话
3. 在新窗口中：
   - 点击状态栏的 "Ponder" 按钮
   - 或使用命令面板 (Ctrl+Shift+P) 搜索 "Ponder: 登录到 Ponder 服务"

### 3. 预期流程
1. 扩展调用 `/api/vscode/authorize` 获取 GitHub 授权 URL
2. 浏览器打开 GitHub 授权页面
3. 用户授权后，GitHub 重定向到 VSCode
4. 扩展调用 `/api/vscode/callback` 交换访问令牌
5. 扩展存储会话并更新 UI 状态

## 🔍 调试信息

### 查看扩展日志
1. 在 VSCode 中打开输出面板 (View > Output)
2. 选择 "Ponder Authentication" 通道
3. 查看详细的认证流程日志

### 网络请求调试
扩展会记录所有 API 请求的详细信息，包括：
- 请求 URL 和参数
- 响应状态码
- 错误信息

## ⚠️ 注意事项

### 1. CORS 配置
确保后端服务器允许来自 VSCode 的跨域请求。

### 2. GitHub OAuth 应用配置
确保 GitHub OAuth 应用的回调 URL 包含：
```
vscode://ponder.ponder-authentication/auth-complete
```

### 3. 错误处理
后端应该返回适当的错误响应：
```json
{
  "error": "invalid_request",
  "error_description": "详细错误描述"
}
```

## 📞 故障排除

### 常见问题

1. **404 错误** - API 端点未实现
2. **CORS 错误** - 跨域配置问题
3. **授权失败** - GitHub OAuth 配置问题
4. **令牌无效** - 访问令牌格式或权限问题

### 解决方案

1. 检查后端服务器日志
2. 查看 VSCode 扩展输出日志
3. 验证 GitHub OAuth 应用配置
4. 测试 API 端点的直接访问

## 🎯 下一步

1. **实现后端 API** - 根据上述规范实现三个端点
2. **测试完整流程** - 在 VSCode 中测试端到端的认证流程
3. **优化用户体验** - 根据测试结果优化错误处理和用户提示
4. **部署配置** - 为生产环境配置适当的服务器地址

---

**🔗 扩展已准备就绪，等待后端 API 实现完成！**
