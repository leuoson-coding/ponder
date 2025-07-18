# 🐛 调试 JSON 解析错误指南

## 🔍 问题分析

"Unexpected end of JSON input" 错误表明后端返回的响应不是有效的 JSON 格式。

## ✅ 已增强的错误处理

我已经增强了错误处理和日志记录，现在扩展会：

1. **记录所有请求和响应** - 详细的日志信息
2. **处理非 JSON 响应** - 如果响应不是 JSON，会使用备用逻辑
3. **显示具体错误信息** - 更详细的错误描述

## 🚀 测试步骤

### 1. 启动调试会话
1. 在 VSCode 中打开 `extensions/ponder-authentication`
2. 按 **F5** 启动调试会话
3. 在新窗口中点击状态栏的 "Ponder" 按钮

### 2. 查看详细日志
1. 在调试的 VSCode 窗口中
2. 打开 **View > Output**
3. 选择 **"Ponder Authentication"** 通道
4. 查看详细的请求和响应日志

### 3. 预期的日志信息
你应该看到类似这样的日志：

```
[INFO] 请求授权URL: http://localhost:3001/vscode/auth/authorize?redirect_uri=...&scope=user
[INFO] 授权URL响应状态: 200 OK
[INFO] 授权URL响应内容: <!DOCTYPE html>...
[WARN] 响应不是JSON格式，使用请求URL作为授权URL
```

## 🔧 可能的后端响应格式

### 情况 1: 后端返回 JSON
```json
{
  "authorization_url": "http://localhost:3001/vscode/auth?session=abc123",
  "state": "random_state_string"
}
```

### 情况 2: 后端直接提供登录页面
- 扩展会直接打开 `http://localhost:3001/vscode/auth/authorize?...`
- 用户在这个页面完成登录
- 页面应该重定向到 `vscode://ponder.ponder-authentication/auth-complete?code=...`

### 情况 3: 后端返回重定向
- HTTP 302/301 重定向到实际的登录页面
- 浏览器会自动跟随重定向

## 📋 后端集成检查清单

### 1. 检查 `/vscode/auth/authorize` 端点
- [ ] 端点是否存在并响应 200
- [ ] 响应格式是什么（JSON、HTML、重定向）
- [ ] 是否正确处理 `redirect_uri` 和 `scope` 参数

### 2. 检查登录页面
- [ ] 登录页面是否正确显示
- [ ] 用户完成登录后是否重定向到 VSCode
- [ ] 重定向 URL 格式：`vscode://ponder.ponder-authentication/auth-complete?code=授权码&state=状态`

### 3. 检查 `/vscode/auth/callback` 端点
- [ ] 端点是否存在并响应 200
- [ ] 是否返回有效的 JSON 格式
- [ ] JSON 是否包含 `access_token` 和 `account` 信息

## 🔍 调试技巧

### 1. 使用浏览器开发者工具
1. 手动访问 `http://localhost:3001/vscode/auth/authorize?redirect_uri=test&scope=user`
2. 查看响应内容和格式
3. 检查网络请求和响应

### 2. 使用 curl 测试
```bash
# 测试授权端点
curl -v "http://localhost:3001/vscode/auth/authorize?redirect_uri=test&scope=user"

# 测试回调端点
curl -v -X POST -H "Content-Type: application/json" \
  -d '{"code":"test","state":"test","redirect_uri":"test"}' \
  "http://localhost:3001/vscode/auth/callback"
```

### 3. 检查 VSCode 扩展日志
- 所有网络请求和响应都会被记录
- 查找 "请求授权URL"、"令牌交换请求" 等关键信息
- 注意任何错误或警告消息

## 🎯 下一步

1. **运行调试会话** - 按照上述步骤启动调试
2. **查看日志** - 检查详细的请求和响应日志
3. **分享日志** - 如果仍有问题，分享日志信息以便进一步诊断

现在试试重新调试扩展，应该能看到更详细的错误信息了！
