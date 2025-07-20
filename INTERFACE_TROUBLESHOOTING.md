# Ponder IDE 界面问题诊断指南

## 当前状态

✅ **Ponder IDE 已成功启动**
- 进程 `Code - OSS.exe` 正在运行
- 应用程序已加载并初始化
- 扩展系统正常工作

❓ **界面显示问题**
- 报告界面为空白或没有内容显示

## 可能的原因和解决方案

### 1. 工作区未正确加载

**症状**: 界面显示但没有文件或文件夹
**解决方案**:
```bash
# 使用测试工作区启动
.\run-ponder-workspace.cmd

# 或者手动打开文件夹
# 在 Ponder IDE 中: File > Open Folder > 选择 test-workspace
```

### 2. 界面元素未正确渲染

**症状**: 完全空白的窗口
**解决方案**:
1. **刷新窗口**: 按 `Ctrl + R`
2. **强制刷新**: 按 `Ctrl + Shift + R`
3. **重置窗口**: 按 `Ctrl + Shift + P` 然后输入 "Reload Window"

### 3. 面板被隐藏

**症状**: 主编辑区域可见但侧边栏/面板不可见
**解决方案**:
1. **显示文件浏览器**: 按 `Ctrl + Shift + E`
2. **显示侧边栏**: 按 `Ctrl + B`
3. **显示面板**: 按 `Ctrl + J`
4. **显示活动栏**: `View > Appearance > Activity Bar`

### 4. 主题或样式问题

**症状**: 界面元素存在但颜色异常或不可见
**解决方案**:
1. **切换主题**: 按 `Ctrl + K, Ctrl + T` 选择不同主题
2. **重置主题**: `File > Preferences > Color Theme > Dark+ (default dark)`

### 5. 扩展冲突

**症状**: 界面加载缓慢或部分功能不工作
**解决方案**:
1. **禁用扩展模式启动**: 使用 `--disable-extensions` 参数
2. **安全模式**: 按 `Ctrl + Shift + P` 然后输入 "Help: Restart in Safe Mode"

## 诊断步骤

### 步骤 1: 检查开发者工具
1. 按 `F12` 打开开发者工具
2. 查看 Console 标签页是否有错误信息
3. 查看 Network 标签页是否有加载失败的资源

### 步骤 2: 检查菜单栏
1. 点击 `View` 菜单
2. 确保以下选项已勾选:
   - ✅ Activity Bar
   - ✅ Side Bar
   - ✅ Status Bar
   - ✅ Panel (可选)

### 步骤 3: 尝试打开文件
1. 按 `Ctrl + O` 打开文件对话框
2. 导航到 `test-workspace` 文件夹
3. 打开 `hello.js` 或 `README.md`

### 步骤 4: 检查窗口状态
1. 确保窗口没有最小化
2. 尝试调整窗口大小
3. 检查是否有多个 Ponder IDE 窗口打开

## 快速修复命令

### 重新启动 Ponder IDE
```bash
# 关闭所有 Ponder IDE 进程
taskkill /F /IM "Code - OSS.exe"

# 重新启动
.\run-ponder-workspace.cmd
```

### 清除用户数据（重置设置）
```bash
# 备份当前设置
xcopy "%APPDATA%\code-oss-dev" "%APPDATA%\code-oss-dev-backup" /E /I

# 删除用户数据（这将重置所有设置）
rmdir /S /Q "%APPDATA%\code-oss-dev"

# 重新启动
.\run-ponder-workspace.cmd
```

### 使用不同的用户数据目录
```bash
# 创建新的启动脚本使用临时用户数据
echo @echo off > run-ponder-clean.cmd
echo ".build\electron\Code - OSS.exe" test-workspace --user-data-dir="%TEMP%\ponder-clean" --new-window >> run-ponder-clean.cmd

# 运行
.\run-ponder-clean.cmd
```

## 常见键盘快捷键

| 功能 | 快捷键 |
|------|--------|
| 打开文件 | `Ctrl + O` |
| 打开文件夹 | `Ctrl + K, Ctrl + O` |
| 命令面板 | `Ctrl + Shift + P` |
| 文件浏览器 | `Ctrl + Shift + E` |
| 搜索 | `Ctrl + Shift + F` |
| 源代码管理 | `Ctrl + Shift + G` |
| 扩展 | `Ctrl + Shift + X` |
| 终端 | `Ctrl + \`` |
| 刷新窗口 | `Ctrl + R` |
| 开发者工具 | `F12` |

## 如果问题仍然存在

1. **检查系统要求**:
   - Windows 10/11
   - 足够的内存 (建议 4GB+)
   - 显卡驱动程序最新

2. **尝试不同的启动参数**:
   ```bash
   # 禁用硬件加速
   ".build\electron\Code - OSS.exe" test-workspace --disable-gpu
   
   # 禁用沙盒
   ".build\electron\Code - OSS.exe" test-workspace --no-sandbox
   
   # 安全模式
   ".build\electron\Code - OSS.exe" test-workspace --disable-extensions --disable-gpu
   ```

3. **检查防病毒软件**: 某些防病毒软件可能阻止 Electron 应用正常运行

4. **重新编译项目**:
   ```bash
   npm run compile
   .\run-ponder-workspace.cmd
   ```

## 报告问题

如果以上步骤都无法解决问题，请提供以下信息：
1. 操作系统版本
2. 开发者工具中的错误信息
3. 启动时的控制台输出
4. 是否能看到菜单栏
5. 窗口是否响应鼠标点击

## 成功指标

界面正常工作时，您应该能看到：
- ✅ 左侧文件浏览器显示 `test-workspace` 文件夹
- ✅ 可以点击打开 `hello.js` 和 `README.md` 文件
- ✅ 语法高亮正常工作
- ✅ 菜单栏可以正常使用
- ✅ 状态栏显示在底部
- ✅ 可以使用 `Ctrl + \`` 打开终端
