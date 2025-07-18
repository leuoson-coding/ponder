# 🐛 Ponder 认证扩展调试指南

## ✅ 问题已修复

调试配置问题已经解决！现在你可以正常调试扩展了。

## 🚀 调试步骤

### 方法一：直接调试（推荐）
1. 在 VSCode 中打开 `extensions/ponder-authentication` 文件夹
2. 按 **F5** 或点击调试按钮
3. 选择 **"Run Extension"** 配置
4. 新的 VSCode 窗口会打开，扩展已加载

### 方法二：编译后调试
1. 在 VSCode 中打开 `extensions/ponder-authentication` 文件夹
2. 按 **Ctrl+Shift+P** 打开命令面板
3. 选择 **"Debug: Select and Start Debugging"**
4. 选择 **"Run Extension (with compile)"** 配置

## 🔍 验证扩展是否正常加载

在新打开的 VSCode 窗口中：

### 1. 检查状态栏
- 右下角应该显示 **"$(account) Ponder"** 按钮
- 点击该按钮应该触发登录流程

### 2. 使用命令面板
- 按 **Ctrl+Shift+P** 打开命令面板
- 搜索 **"Ponder"**
- 应该看到以下命令：
  - `Ponder: 登录到 Ponder 服务`
  - `Ponder: 退出登录`

### 3. 查看扩展列表
- 按 **Ctrl+Shift+X** 打开扩展面板
- 在搜索框中输入 **"@builtin ponder"**
- 应该看到 **"Ponder Authentication"** 扩展

## 📋 调试配置说明

现在有三个调试配置可用：

1. **"Run Extension"** - 直接运行（不重新编译）
2. **"Run Extension (with compile)"** - 先编译再运行
3. **"Extension Tests"** - 运行测试

## 🔧 如果仍有问题

### 手动编译
```bash
cd extensions/ponder-authentication
npm run compile
```

### 检查输出文件
确保 `out/` 目录包含以下文件：
- `extension.js`
- `authProvider.js`
- `logger.js`
- `telemetryReporter.js`

### 查看调试日志
1. 在调试的 VSCode 窗口中
2. 打开 **View > Output**
3. 选择 **"Ponder Authentication"** 通道
4. 查看详细日志信息

## 🎯 测试认证功能

### 1. 触发登录
- 点击状态栏的 "Ponder" 按钮
- 或使用命令面板执行登录命令

### 2. 预期行为
- 扩展会尝试连接到 `http://localhost:3000`
- 如果后端 API 未实现，会显示相应错误
- 所有操作都会记录在输出日志中

### 3. 错误处理
- 网络错误会显示友好的错误消息
- 详细错误信息会记录在日志中

## 📞 常见问题

### Q: 状态栏没有显示 Ponder 按钮
**A:** 检查扩展是否正确激活，查看调试控制台是否有错误信息。

### Q: 命令面板找不到 Ponder 命令
**A:** 确保扩展已正确加载，检查 `package.json` 中的命令配置。

### Q: 点击登录按钮没有反应
**A:** 查看输出面板的日志，可能是网络连接或后端 API 问题。

---

**🎉 现在你可以正常调试 Ponder 认证扩展了！**
