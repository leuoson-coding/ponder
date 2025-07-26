# Ponder Authentication Extension Build Guide

## 构建扩展

### 1. 安装依赖

```bash
cd ponder/extensions/ponder-authentication
npm install
```

### 2. 编译扩展

```bash
# 编译 TypeScript
npm run compile

# 或者监听模式
npm run watch
```

### 3. 构建整个 Ponder

在 ponder 根目录：

```bash
# 安装依赖
npm install

# 构建扩展
npm run compile-extensions

# 构建整个项目
npm run compile
```

## 验证扩展安装

### 1. 检查扩展是否被识别

启动 Ponder IDE 后：

1. 打开命令面板 (`Ctrl+Shift+P`)
2. 运行 `Developer: Show Running Extensions`
3. 查找 `ponder-authentication`

### 2. 检查认证提供者

在开发者控制台中：

```javascript
// 检查认证提供者是否注册
vscode.authentication.getProviders().then(providers => {
    console.log('Available providers:', providers);
    // 应该包含 'ponder'
});
```

### 3. 测试认证流程

```javascript
// 尝试获取会话
vscode.authentication.getSession('ponder', ['read', 'write'], { createIfNone: true })
    .then(session => {
        console.log('Session created:', session);
    })
    .catch(error => {
        console.error('Authentication failed:', error);
    });
```

## 故障排除

### 1. 扩展未加载

**检查**:
- `ponder/product.json` 中是否包含 ponder-authentication
- `ponder/build/gulpfile.extensions.js` 中是否包含 tsconfig 路径
- 扩展的 `package.json` 是否正确

### 2. TypeScript 编译错误

**解决**:
```bash
cd ponder/extensions/ponder-authentication
npm run compile
```

检查编译输出中的错误信息。

### 3. 认证流程失败

**检查**:
1. ponder-api 是否运行在 `http://localhost:3000`
2. OAuth 配置是否正确
3. 网络连接是否正常
4. 查看 "Ponder Authentication" 输出通道的日志

## 开发模式

### 1. 监听模式

```bash
cd ponder/extensions/ponder-authentication
npm run watch
```

### 2. 重新加载扩展

在 Ponder IDE 中：
1. `Ctrl+Shift+P`
2. `Developer: Reload Window`

### 3. 查看日志

1. `View` > `Output`
2. 选择 "Ponder Authentication" 通道
