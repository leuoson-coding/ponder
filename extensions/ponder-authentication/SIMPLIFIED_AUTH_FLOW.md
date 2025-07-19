# 简化的VSCode身份验证对接流程

## 流程概述

基于您的建议，我们简化了身份验证流程，去除了多余的中间步骤：

### 旧流程（复杂）
```
用户登录 → access_token → 授权码 → JWT token
```

### 新流程（简化）
```
用户登录 → 授权码 → JWT token
```

## 后端API接口

### 1. 登录页面
```
GET /vscode/auth
参数：
- redirect_uri: VSCode回调地址
- scope: 权限范围  
- state: 状态参数
```

### 2. 直接登录获取授权码（新增）
```
POST /api/vscode/login
请求体：
{
    "username": "用户名",
    "password": "密码", 
    "state": "状态参数",
    "redirect_uri": "回调地址"
}

响应：
{
    "auth_code": "kBipgwlGOLVIg71k4byF2LXe331bzebY",
    "state": "1752902398699",
    "success": true,
    "user": {
        "email": "",
        "id": 1,
        "username": "root"
    }
}
```

### 3. 授权码换取JWT令牌
```
POST /api/vscode/callback
请求体：
{
    "code": "授权码",
    "state": "状态参数",
    "redirect_uri": "回调地址"
}

响应：
{
    "access_token": "JWT令牌",
    "account": {
        "id": "1",
        "label": "root"
    }
}
```

### 4. 获取用户信息
```
GET /api/vscode/user
请求头：
Authorization: Bearer <JWT令牌>

响应：
{
    "username": "root",
    "email": "user@example.com"
}
```

## VSCode扩展修改

已修改以下文件以适配新的API路径：

1. **authProvider.ts**
   - 修改令牌交换接口路径：`/vscode/auth/callback` → `/api/vscode/callback`
   - 更新日志信息

2. **extension.ts**  
   - 修改用户信息接口路径：`/vscode/auth/user` → `/api/vscode/user`

## 测试流程

### 1. 启动后端服务
```bash
go run main.go
```

### 2. 测试直接登录接口
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/vscode/login" -Method POST -ContentType "application/json" -Body '{"username":"root","password":"123456","state":"test-state","redirect_uri":"vscode://test/callback"}'
```

### 3. 测试完整流程
```powershell
# 获取授权码
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/vscode/login" -Method POST -ContentType "application/json" -Body '{"username":"root","password":"123456","state":"test-state","redirect_uri":"vscode://test/callback"}'

# 用授权码换取JWT令牌
$tokenResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/vscode/callback" -Method POST -ContentType "application/json" -Body "{`"code`":`"$($response.auth_code)`",`"state`":`"$($response.state)`",`"redirect_uri`":`"vscode://test/callback`"}"

Write-Host "JWT Token: $($tokenResponse.access_token)"
```

### 4. 在VSCode中测试
1. 按F5启动调试会话
2. 在新窗口中点击状态栏的"Ponder"按钮
3. 浏览器打开登录页面，使用root/123456登录
4. 查看VSCode输出面板的"Ponder Authentication"日志

## 安全性分析

### 保持的安全特性
- ✅ 授权码一次性使用
- ✅ 授权码有过期时间
- ✅ 状态参数防CSRF攻击
- ✅ JWT令牌用于API认证

### 简化的优势
- ✅ 减少了不必要的中间步骤
- ✅ 降低了实现复杂度
- ✅ 保持了OAuth 2.0的核心安全机制
- ✅ 前端逻辑更加直观

## 配置说明

确保VSCode设置中配置正确的服务器地址：
```json
{
    "ponder-authentication.serverUrl": "http://localhost:3001"
}
```

## 故障排除

1. **404错误**：确保后端服务已启动并包含新的API路由
2. **认证失败**：检查用户名密码是否正确
3. **令牌无效**：检查JWT签名密钥配置
4. **回调失败**：确保redirect_uri格式正确

这个简化流程既保持了安全性，又提高了开发和维护的效率！
