# Ponder IDE 图标更新指南

## 1. 认证系统回调地址更新

已完成以下更新：

### extensions/ponder-authentication/package.json
- 更新了 `authorizationServerGlobs` 中的回调路径：
  - `https://*.ponder.com/vscode/*` → `https://*.ponder.com/ponder/*`
  - `http://localhost:3001/vscode/*` → `http://localhost:3001/ponder/*`
  - `http://localhost:*/vscode/*` → `http://localhost:*/ponder/*`

### extensions/ponder-authentication/src/authProvider.ts
- 更新了授权URL路径：`/vscode/auth` → `/ponder/auth`
- 更新了回调API路径：`/api/vscode/callback` → `/api/ponder/callback`
- 更新了注释中的API引用：`/api/vscode/login` → `/api/ponder/login`

## 2. 图标文件替换计划

基于现有的 `ponder-icon.png` 文件，需要进行以下操作：

### 主要图标文件替换

#### Windows 图标 (resources/win32/)
```bash
# 需要将 ponder-icon.png 转换为不同格式和尺寸
# 主应用图标
convert ponder-icon.png -resize 256x256 resources/win32/code.ico

# Windows 磁贴图标
convert ponder-icon.png -resize 150x150 resources/win32/code_150x150.png
convert ponder-icon.png -resize 70x70 resources/win32/code_70x70.png

# 重命名为 ponder 相关名称
mv resources/win32/code.ico resources/win32/ponder.ico
mv resources/win32/code_150x150.png resources/win32/ponder_150x150.png
mv resources/win32/code_70x70.png resources/win32/ponder_70x70.png
```

#### macOS 图标 (resources/darwin/)
```bash
# 需要创建 .icns 格式的图标包
# 使用 iconutil 或 png2icns 工具
mkdir ponder.iconset
convert ponder-icon.png -resize 16x16 ponder.iconset/icon_16x16.png
convert ponder-icon.png -resize 32x32 ponder.iconset/icon_16x16@2x.png
convert ponder-icon.png -resize 32x32 ponder.iconset/icon_32x32.png
convert ponder-icon.png -resize 64x64 ponder.iconset/icon_32x32@2x.png
convert ponder-icon.png -resize 128x128 ponder.iconset/icon_128x128.png
convert ponder-icon.png -resize 256x256 ponder.iconset/icon_128x128@2x.png
convert ponder-icon.png -resize 256x256 ponder.iconset/icon_256x256.png
convert ponder-icon.png -resize 512x512 ponder.iconset/icon_256x256@2x.png
convert ponder-icon.png -resize 512x512 ponder.iconset/icon_512x512.png
convert ponder-icon.png -resize 1024x1024 ponder.iconset/icon_512x512@2x.png

iconutil -c icns ponder.iconset
mv ponder.icns resources/darwin/code.icns
```

#### Linux 图标 (resources/linux/)
```bash
# 直接复制 PNG 格式
cp ponder-icon.png resources/linux/code.png
```

#### Web/服务器图标 (resources/server/)
```bash
# 创建不同尺寸的 web 图标
convert ponder-icon.png -resize 192x192 resources/server/ponder-192.png
convert ponder-icon.png -resize 512x512 resources/server/ponder-512.png

# 创建 favicon
convert ponder-icon.png -resize 32x32 resources/server/favicon.ico
```

### 扩展图标
```bash
# 为认证扩展创建图标
convert ponder-icon.png -resize 128x128 extensions/ponder-authentication/media/icon.png
```

## 3. 配置文件更新

### 更新 Windows VisualElementsManifest.xml
已更新图标路径引用：
- `code_150x150.png` → `ponder_150x150.png`
- `code_70x70.png` → `ponder_70x70.png`

### 更新 resources/server/manifest.json
已更新图标文件名：
- `code-192.png` → `ponder-192.png`
- `code-512.png` → `ponder-512.png`

## 4. 蓝色主题配置

为了实现蓝色主题，需要更新以下文件：

### 主题颜色配置
可以在以下位置添加蓝色主题配置：
- `src/vs/workbench/common/theme.ts`
- `src/vs/platform/theme/common/colorRegistry.ts`

### 建议的蓝色主题色值
```css
/* 主要蓝色 */
--ponder-primary-blue: #0078d4;
--ponder-secondary-blue: #106ebe;
--ponder-light-blue: #deecf9;
--ponder-dark-blue: #004578;

/* 状态栏和标题栏 */
--ponder-statusbar-background: #0078d4;
--ponder-titlebar-background: #106ebe;

/* 按钮和链接 */
--ponder-button-background: #0078d4;
--ponder-link-color: #0078d4;
```

## 5. 执行步骤

1. **安装图像处理工具**（如果需要）：
   ```bash
   # Ubuntu/Debian
   sudo apt-get install imagemagick

   # macOS
   brew install imagemagick

   # Windows
   # 下载并安装 ImageMagick
   ```

2. **执行图标转换脚本**：
   ```bash
   # 运行上述的图标转换命令
   ```

3. **测试认证系统**：
   - 启动 Ponder IDE
   - 测试认证扩展的登录功能
   - 验证回调地址是否正确工作

4. **验证图标显示**：
   - 检查应用程序图标在各平台上的显示
   - 验证 Windows 磁贴图标
   - 检查 Web 版本的图标

## 6. 注意事项

- 确保所有图标文件都使用相同的设计风格
- 测试不同分辨率下的图标显示效果
- 验证图标在深色和浅色主题下的可见性
- 确保认证回调URL在服务器端也相应更新

## 7. 测试清单

- [ ] Windows 应用图标显示正确
- [ ] Windows 磁贴图标显示正确
- [ ] macOS 应用图标显示正确
- [ ] Linux 应用图标显示正确
- [ ] Web 版本图标显示正确
- [ ] 认证系统登录功能正常
- [ ] 回调地址工作正常
- [ ] 蓝色主题应用正确
