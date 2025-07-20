# Ponder IDE 开发指南

## 快速开始

### 1. 环境要求
- Node.js 18+ 
- npm 或 yarn
- Git
- Windows 10/11 (当前测试环境)

### 2. 安装依赖
```bash
npm install
```

### 3. 编译项目
```bash
npm run compile
```

### 4. 启动开发版本

#### 方法一：使用自定义启动脚本（推荐）
```bash
# Windows CMD
run-ponder.cmd

# 或者 PowerShell
.\run-ponder.cmd
```

#### 方法二：直接启动 Electron
```bash
# PowerShell
& ".build\electron\Code - OSS.exe" . --disable-extension=vscode.vscode-api-tests
```

#### 方法三：使用原始脚本（可能遇到扩展下载问题）
```bash
# Windows
scripts\code.bat

# Linux/macOS
./scripts/code.sh
```

## 开发模式功能

### 环境变量
启动时会自动设置以下环境变量：
- `NODE_ENV=development` - 开发模式
- `VSCODE_DEV=1` - 启用开发者功能
- `VSCODE_CLI=1` - 命令行模式
- `ELECTRON_ENABLE_LOGGING=1` - 启用 Electron 日志
- `ELECTRON_ENABLE_STACK_DUMPING=1` - 启用堆栈转储
- `VSCODE_SKIP_PRELAUNCH=1` - 跳过预启动检查（避免扩展下载失败）

### 开发者工具
- 按 `F12` 或 `Ctrl+Shift+I` 打开开发者工具
- 按 `Ctrl+R` 重新加载窗口
- 按 `Ctrl+Shift+R` 硬重新加载

## 项目结构

### 主要目录
```
ponder/
├── src/                    # 源代码
├── extensions/             # 内置扩展
│   └── ponder-authentication/  # 认证扩展
├── resources/              # 资源文件
│   ├── win32/             # Windows 资源
│   ├── darwin/            # macOS 资源
│   ├── linux/             # Linux 资源
│   └── server/            # Web 服务器资源
├── scripts/               # 构建和启动脚本
├── .build/                # 构建输出
│   └── electron/          # Electron 应用
├── out/                   # 编译输出
└── node_modules/          # 依赖包
```

### 关键文件
- `product.json` - 产品配置
- `package.json` - 项目配置和脚本
- `gulpfile.js` - 构建配置

## 常用开发命令

### 编译相关
```bash
# 完整编译
npm run compile

# 监视模式编译（自动重新编译）
npm run watch

# 只编译客户端
npm run watch-client

# 只编译扩展
npm run watch-extensions

# Web 版本编译
npm run compile-web
npm run watch-web
```

### 测试相关
```bash
# 运行单元测试
npm run test-node

# 运行浏览器测试
npm run test-browser

# 运行扩展测试
npm run test-extension
```

### 代码质量
```bash
# ESLint 检查
npm run eslint

# 样式检查
npm run stylelint

# 代码卫生检查
npm run hygiene
```

## 故障排除

### 常见问题

#### 1. 启动时出现 404 错误（扩展下载失败）
**问题**：尝试从 GitHub 下载认证扩展失败
```
Error: Request https://api.github.com/repos/your-org/ponder/releases/tags/v0.0.1 failed with status code: 404
```

**解决方案**：
- 使用 `VSCODE_SKIP_PRELAUNCH=1` 环境变量跳过预启动检查
- 或者使用自定义启动脚本 `run-ponder.cmd`

#### 2. Electron 可执行文件找不到
**问题**：`Ponder.exe` 不存在

**解决方案**：
- 当前 Electron 可执行文件名为 `Code - OSS.exe`
- 需要重新构建才能生成正确的 `Ponder.exe`

#### 3. 编译失败
**解决方案**：
```bash
# 清理并重新安装依赖
rm -rf node_modules
npm install

# 重新编译
npm run compile
```

#### 4. 端口冲突
如果运行 Web 版本时遇到端口冲突：
```bash
# 使用不同端口
./scripts/code-web.sh --port 3002
```

### 调试技巧

#### 1. 启用详细日志
```bash
# 设置日志级别
set VSCODE_LOG_LEVEL=trace

# 启动应用
run-ponder.cmd
```

#### 2. 检查进程
```bash
# 查看 Electron 进程
tasklist | findstr "Code - OSS"

# 或者
tasklist | findstr "electron"
```

#### 3. 清理缓存
```bash
# 清理用户数据
rmdir /s "%APPDATA%\.ponder"

# 清理构建缓存
rmdir /s ".build"
npm run compile
```

## Web 版本开发

### 启动 Web 服务器
```bash
# 启动开发服务器
./scripts/code-web.sh

# Windows
scripts\code-web.bat
```

### 访问地址
- 本地开发：http://localhost:8080
- 带认证：http://localhost:8080/?tkn=your-token

## 扩展开发

### 认证扩展
位置：`extensions/ponder-authentication/`

#### 主要文件
- `package.json` - 扩展配置
- `src/authProvider.ts` - 认证提供者
- `media/icon.png` - 扩展图标

#### 开发流程
1. 修改扩展代码
2. 运行 `npm run watch-extensions` 监视变化
3. 重新加载 Ponder IDE 窗口 (`Ctrl+R`)

## 构建发布版本

### 完整构建
```bash
# 构建所有平台
npm run compile-build

# 构建扩展
npm run compile-extensions-build

# 压缩优化
npm run minify-vscode
```

### 平台特定构建
```bash
# Windows
npm run minify-vscode

# Web 版本
npm run minify-vscode-reh-web
```

## 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

## 相关文档

- [VSCode 开发文档](https://github.com/microsoft/vscode/wiki)
- [Electron 文档](https://www.electronjs.org/docs)
- [认证系统配置](./IMPLEMENTATION_SUMMARY.md)
- [图标更新指南](./update-icons.md)
