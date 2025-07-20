# Ponder IDE Rebranding Summary

This document summarizes all the changes made to rebrand the VSCode fork to "Ponder IDE".

## Core Configuration Changes

### product.json
- Changed `nameShort` from "Code - OSS" to "Ponder"
- Changed `nameLong` from "Code - OSS" to "Ponder IDE"
- Changed `applicationName` from "code-oss" to "ponder"
- Changed `dataFolderName` from ".vscode-oss" to ".ponder"
- Changed `win32MutexName` from "vscodeoss" to "ponder"
- Updated all Windows application GUIDs to new unique values
- Changed `darwinBundleIdentifier` from "com.visualstudio.code.oss" to "com.ponder.ide"
- Changed `linuxIconName` from "code-oss" to "ponder"
- Changed `urlProtocol` from "code-oss" to "ponder"
- Updated license URLs to point to Ponder repository
- Updated webview CDN URL template

### package.json
- Changed `name` from "code-oss-dev" to "ponder-ide"
- Changed `author.name` from "Microsoft Corporation" to "Ponder Team"

## Platform-Specific Changes

### Windows (resources/win32/)
- Updated VisualElementsManifest.xml with Ponder branding
- Updated shell scripts (code.sh, code.cmd) with Ponder environment variables
- Icon files need replacement (see ICON_REPLACEMENT_GUIDE.md)

### macOS (resources/darwin/)
- Updated shell script (code.sh) with Ponder environment variables
- Icon files need replacement (see ICON_REPLACEMENT_GUIDE.md)

### Linux (resources/linux/)
- Updated desktop files with Ponder descriptions and keywords
- Updated AppData XML with Ponder information and URLs
- Updated RPM spec template with Ponder vendor and URLs
- Updated Debian postinstall script references

## Web/Server Assets

### resources/server/
- Updated manifest.json with Ponder name and icon references
- Icon files need replacement (code-192.png → ponder-192.png, etc.)

## Documentation Updates

### README.md
- Complete rewrite with Ponder branding
- Updated all GitHub URLs to point to Ponder repository
- Updated feature descriptions and project information
- Changed social media references

## Extension Configuration

### extensions/
- Updated main extensions package.json and package-lock.json
- Ponder-authentication extension already properly configured

## Build and Development Files

### Configuration Files
- Updated callback.html branding text
- Updated development server scripts
- Updated VSCode settings references
- Updated various build script references

## Environment Variables Changed

The following environment variables were updated throughout the codebase:
- `VSCODE_*` → `PONDER_*`
- `VSCODE_PATH` → `PONDER_PATH`
- `VSCODE_DEV` → `PONDER_DEV`
- `VSCODE_WSL_DEBUG_INFO` → `PONDER_WSL_DEBUG_INFO`
- `VSCODE_IPC_HOOK_CLI` → `PONDER_IPC_HOOK_CLI`
- `VSCODE_NODE_OPTIONS` → `PONDER_NODE_OPTIONS`

## URLs and References Updated

- GitHub repository URLs: `microsoft/vscode` → `your-org/ponder`
- Website URLs: `code.visualstudio.com` → `github.com/your-org/ponder`
- Documentation URLs: Updated to point to Ponder wiki/docs
- Issue tracking URLs: Updated to Ponder repository
- Social media: `@code` → `@PonderIDE`

## Files Requiring Manual Icon Replacement

See `ICON_REPLACEMENT_GUIDE.md` for complete list of icon files that need to be replaced with Ponder-branded versions.

## Next Steps

1. Replace all icon files with Ponder-branded versions
2. Test application build and startup
3. Verify URL protocol handling works correctly
4. Test extension loading and functionality
5. Validate Windows integration (tiles, file associations)
6. Test macOS bundle and file associations
7. Test Linux desktop integration

## Notes

- All Windows GUIDs have been changed to prevent conflicts with existing VSCode installations
- The rebranding maintains compatibility with the existing VSCode extension ecosystem
- Build scripts and development workflows remain largely unchanged
- The core functionality and architecture are preserved
