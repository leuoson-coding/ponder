# Ponder IDE Identifier Validation Guide

This document provides validation steps for all the new identifiers and protocols introduced during the rebranding.

## Application Identifiers Changed

### Core Application Names
- **Application Name**: `code-oss` → `ponder`
- **Short Name**: `Code - OSS` → `Ponder`
- **Long Name**: `Code - OSS` → `Ponder IDE`

### Data Folder Names
- **User Data**: `.vscode-oss` → `.ponder`
- **Server Data**: `.vscode-server-oss` → `.ponder-server`

### URL Protocol
- **Protocol**: `code-oss://` → `ponder://`

## Windows-Specific Identifiers

### Application IDs (New GUIDs Generated)
- **x64 App ID**: `{A8F2E1C3-9B4D-4E5F-8A7B-1C2D3E4F5A6B}`
- **ARM64 App ID**: `{B9E3F2D4-AC5E-4F6A-9B8C-2D3E4F5A6B7C}`
- **x64 User App ID**: `{C1F4E3D5-BD6F-4A7B-AC9D-3E4F5A6B7C8D}`
- **ARM64 User App ID**: `{D2E5F4A6-CE7A-4B8C-BD1E-4F5A6B7C8D9E}`

### Windows Registry and System Integration
- **App User Model ID**: `Microsoft.CodeOSS` → `Ponder.IDE`
- **Registry Value Name**: `CodeOSS` → `Ponder`
- **Directory Name**: `Microsoft Code OSS` → `Ponder IDE`
- **Mutex Names**: `vscodeoss*` → `ponder*`

## macOS-Specific Identifiers

### Bundle Identifier
- **Bundle ID**: `com.visualstudio.code.oss` → `com.ponder.ide`

### Profile UUIDs (New UUIDs Generated)
- **Profile UUID**: `E3F6A9B2-8C5D-4E7F-9A1B-2C3D4E5F6A7B`
- **Payload UUID**: `F4A7B1C3-9D6E-4F8A-AB2C-3D4E5F6A7B8C`

## Linux-Specific Identifiers

### Icon and Desktop Integration
- **Icon Name**: `code-oss` → `ponder`
- **Desktop File**: References updated to Ponder

## Validation Tests

### 1. URL Protocol Validation

#### Test URL Protocol Registration
```bash
# Windows
reg query "HKEY_CLASSES_ROOT\ponder"

# macOS
/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -dump | grep ponder

# Linux
xdg-mime query default x-scheme-handler/ponder
```

#### Test URL Protocol Handling
```bash
# Test opening a file via URL protocol
ponder://open?url=file:///path/to/test.txt

# Test opening a workspace
ponder://open?url=file:///path/to/workspace.code-workspace
```

**Expected Results:**
- Ponder IDE opens and loads the specified file/workspace
- No error messages about unknown protocol

### 2. Windows Integration Validation

#### Registry Validation
```powershell
# Check application registration
Get-ItemProperty "HKLM:\SOFTWARE\Classes\Applications\ponder.exe"

# Check file associations
Get-ItemProperty "HKLM:\SOFTWARE\Classes\.js\OpenWithProgids"

# Check URL protocol
Get-ItemProperty "HKLM:\SOFTWARE\Classes\ponder"
```

#### Windows Store Integration
```powershell
# Check app user model ID
Get-StartApps | Where-Object {$_.Name -like "*Ponder*"}
```

#### File Association Test
1. Right-click on a .js file
2. Select "Open with" → "Choose another app"
3. Verify "Ponder IDE" appears in the list
4. Set as default and test opening files

### 3. macOS Integration Validation

#### Bundle Validation
```bash
# Check bundle identifier
/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" /Applications/Ponder.app/Contents/Info.plist

# Check URL scheme registration
/usr/libexec/PlistBuddy -c "Print CFBundleURLTypes" /Applications/Ponder.app/Contents/Info.plist
```

#### Spotlight Integration
```bash
# Test Spotlight search
mdfind "kMDItemDisplayName == 'Ponder*'"
```

#### File Association Test
1. Right-click on a code file in Finder
2. Select "Open With" → "Other..."
3. Verify Ponder.app appears and can be selected
4. Test setting as default application

### 4. Linux Integration Validation

#### Desktop File Validation
```bash
# Check desktop file installation
ls /usr/share/applications/ | grep ponder

# Validate desktop file syntax
desktop-file-validate /usr/share/applications/ponder.desktop

# Check MIME type associations
grep -r ponder /usr/share/applications/
```

#### Icon Theme Integration
```bash
# Check icon installation
find /usr/share/icons -name "*ponder*"

# Test icon display
gtk-update-icon-cache /usr/share/icons/hicolor/
```

### 5. Data Directory Validation

#### User Data Location Test
1. Start Ponder IDE
2. Change a setting
3. Verify settings are saved to `.ponder` folder
4. Check that no `.vscode-oss` folder is created

#### Server Data Location Test (if applicable)
1. Start Ponder in server mode
2. Verify server data is stored in `.ponder-server` folder
3. Check that no `.vscode-server-oss` folder is created

### 6. Extension System Validation

#### Extension Installation Test
1. Install an extension from marketplace
2. Verify extension is stored in `.ponder/extensions`
3. Check extension compatibility with new identifiers

#### Extension API Test
1. Create a simple test extension
2. Verify it can access Ponder-specific APIs
3. Test extension activation and deactivation

### 7. Environment Variable Validation

#### Check Environment Variables
```bash
# Verify Ponder-specific environment variables are set
env | grep PONDER

# Test that old VSCode variables are not interfering
env | grep VSCODE  # Should not affect Ponder
```

### 8. Network and Authentication Validation

#### Ponder Service Integration
1. Test Ponder authentication extension
2. Verify it connects to correct service endpoints
3. Check that authentication tokens are stored correctly

#### Update Service Test
1. Check for updates
2. Verify update URLs point to Ponder repositories
3. Test update download and installation

## Common Issues and Solutions

### URL Protocol Not Working
- **Windows**: Re-register the application or run as administrator
- **macOS**: Reset Launch Services database: `/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user`
- **Linux**: Update MIME database: `update-mime-database ~/.local/share/mime`

### File Associations Not Working
- **Windows**: Check registry entries and re-associate files
- **macOS**: Reset file associations in Finder preferences
- **Linux**: Update desktop database: `update-desktop-database ~/.local/share/applications`

### Settings Not Persisting
- Check file permissions on data directories
- Verify correct data folder paths in configuration
- Test with clean user profile

### Extension Compatibility Issues
- Check extension manifest for hardcoded VSCode references
- Verify extension API compatibility
- Test with minimal extension set

## Validation Checklist

- [ ] URL protocol `ponder://` works correctly
- [ ] Windows file associations use Ponder
- [ ] macOS bundle identifier is correct
- [ ] Linux desktop integration works
- [ ] Settings saved to `.ponder` folder
- [ ] Server data saved to `.ponder-server` folder
- [ ] Extensions install to correct location
- [ ] No conflicts with existing VSCode installation
- [ ] All GUIDs are unique and properly registered
- [ ] Environment variables use PONDER prefix
- [ ] Authentication system uses correct identifiers
- [ ] Update system points to Ponder repositories
- [ ] Error reporting uses Ponder identifiers
- [ ] Telemetry (if enabled) uses Ponder identifiers

## Security Considerations

### GUID Uniqueness
- All Windows GUIDs have been changed to prevent conflicts
- New GUIDs are properly formatted and unique
- No collision with existing Microsoft GUIDs

### URL Protocol Security
- Ponder protocol handlers should validate input
- Prevent arbitrary code execution via URLs
- Implement proper sandboxing for opened files

### Data Isolation
- Ponder data is stored separately from VSCode
- No accidental sharing of sensitive data
- Proper file permissions on data directories

## Performance Impact

### Startup Time
- New identifiers should not impact startup performance
- Registry lookups remain efficient
- File system operations unchanged

### Memory Usage
- No additional memory overhead from identifier changes
- Extension loading performance preserved
- Settings access remains fast

## Rollback Procedures

If issues are discovered with the new identifiers:

1. **Immediate Rollback**: Restore original product.json
2. **Partial Rollback**: Revert specific identifiers causing issues
3. **Clean Installation**: Remove all Ponder data and reinstall
4. **Migration**: Provide tools to migrate data between versions
