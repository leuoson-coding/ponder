# Ponder IDE Icon Replacement Guide

This document outlines all the icon and asset files that need to be replaced with Ponder-branded versions for the complete rebranding of the VSCode fork.

## Windows Icons (resources/win32/)

### Main Application Icons
- `code.ico` → Replace with main Ponder IDE icon (multi-resolution ICO file)
- `code_150x150.png` → Replace with 150x150px Ponder logo for Windows tiles
- `code_70x70.png` → Replace with 70x70px Ponder logo for Windows tiles

### File Type Association Icons
All the following .ico files should be replaced with Ponder-branded versions:
- `bower.ico` - Bower file icon
- `c.ico` - C source file icon
- `config.ico` - Configuration file icon
- `cpp.ico` - C++ source file icon
- `csharp.ico` - C# source file icon
- `css.ico` - CSS file icon
- `default.ico` - Default file icon
- `go.ico` - Go source file icon
- `html.ico` - HTML file icon
- `jade.ico` - Jade template file icon
- `java.ico` - Java source file icon
- `javascript.ico` - JavaScript file icon
- `json.ico` - JSON file icon
- `less.ico` - LESS file icon
- `markdown.ico` - Markdown file icon
- `php.ico` - PHP file icon
- `powershell.ico` - PowerShell file icon
- `python.ico` - Python file icon
- `react.ico` - React file icon
- `ruby.ico` - Ruby file icon
- `sass.ico` - SASS file icon
- `shell.ico` - Shell script file icon
- `sql.ico` - SQL file icon
- `typescript.ico` - TypeScript file icon
- `vue.ico` - Vue.js file icon
- `xml.ico` - XML file icon
- `yaml.ico` - YAML file icon

### Installer Graphics (Inno Setup)
Replace all installer bitmap files with Ponder-branded versions:
- `inno-big-100.bmp` through `inno-big-250.bmp` (7 files)
- `inno-small-100.bmp` through `inno-small-250.bmp` (7 files)

## macOS Icons (resources/darwin/)

### Main Application Icon
- `code.icns` → Replace with main Ponder IDE icon bundle

### File Type Association Icons
All the following .icns files should be replaced:
- `bat.icns`, `bower.icns`, `c.icns`, `config.icns`, `cpp.icns`
- `csharp.icns`, `css.icns`, `default.icns`, `go.icns`, `html.icns`
- `jade.icns`, `java.icns`, `javascript.icns`, `json.icns`, `less.icns`
- `markdown.icns`, `php.icns`, `powershell.icns`, `python.icns`
- `react.icns`, `ruby.icns`, `sass.icns`, `shell.icns`, `sql.icns`
- `typescript.icns`, `vue.icns`, `xml.icns`, `yaml.icns`

## Linux Icons (resources/linux/)

### Main Application Icon
- `code.png` → Replace with main Ponder IDE icon (PNG format)

## Server/Web Icons (resources/server/)

### Web Application Icons
- `code-192.png` → Replace with 192x192px Ponder logo for web app
- `code-512.png` → Replace with 512x512px Ponder logo for web app
- `favicon.ico` → Replace with Ponder favicon

## Icon Design Guidelines

When creating the new Ponder-branded icons:

1. **Consistency**: Maintain consistent visual style across all platforms
2. **Resolution**: Ensure proper resolution for each platform's requirements
3. **Format**: Use appropriate formats (ICO for Windows, ICNS for macOS, PNG for Linux/Web)
4. **Branding**: Incorporate Ponder brand colors and design elements
5. **Accessibility**: Ensure icons are visible and distinguishable in both light and dark themes

## File Naming Convention

After replacement, consider renaming files to reflect Ponder branding:
- `code.ico` → `ponder.ico`
- `code_150x150.png` → `ponder_150x150.png`
- `code_70x70.png` → `ponder_70x70.png`
- etc.

Note: If files are renamed, corresponding references in configuration files must also be updated.
