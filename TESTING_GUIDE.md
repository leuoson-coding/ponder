# Ponder IDE Testing Guide

This guide outlines the testing steps needed to verify the rebranding changes work correctly.

## Prerequisites

1. Ensure all icon files have been replaced with Ponder-branded versions (see ICON_REPLACEMENT_GUIDE.md)
2. Have Node.js and build dependencies installed
3. Have appropriate development tools for your platform

## Build Testing

### 1. Clean Build Test
```bash
# Clean any existing build artifacts
npm run clean  # or equivalent cleanup command

# Install dependencies
npm install

# Build the application
npm run compile
```

**Expected Results:**
- Build completes without errors
- No references to "vscode" or "Microsoft" in build output
- Generated files use "ponder" naming conventions

### 2. Development Build Test
```bash
# Start development build
npm run watch
```

**Expected Results:**
- Development server starts successfully
- File watching works correctly
- Hot reload functionality preserved

## Application Startup Testing

### 3. Basic Startup Test
```bash
# Start the application
./scripts/code.sh  # Linux/macOS
# or
.\scripts\code.bat  # Windows
```

**Expected Results:**
- Application starts without errors
- Window title shows "Ponder IDE" or "Ponder"
- About dialog shows Ponder branding
- No VSCode references in UI

### 4. Command Line Interface Test
```bash
# Test CLI functionality
ponder --version
ponder --help
ponder test-file.txt
```

**Expected Results:**
- Version shows Ponder information
- Help text references Ponder
- File opening works correctly

## Platform-Specific Testing

### Windows Testing

#### 5. Windows Integration Test
- Check Start Menu entry shows "Ponder IDE"
- Verify Windows tiles show Ponder icons
- Test file associations work correctly
- Check "Open with" context menu shows Ponder
- Verify Windows registry entries use Ponder identifiers

#### 6. Windows URL Protocol Test
```
ponder://open?url=file:///path/to/file
```

**Expected Results:**
- URL protocol handler works
- Ponder opens with specified file

### macOS Testing

#### 7. macOS Bundle Test
- Check Applications folder shows Ponder.app
- Verify app icon displays correctly
- Test file associations in Finder
- Check "Open with" menu shows Ponder
- Verify bundle identifier is correct

#### 8. macOS Dock Integration Test
- App appears correctly in Dock
- Right-click menu shows Ponder options
- Badge notifications work

### Linux Testing

#### 9. Linux Desktop Integration Test
- Check application menu shows Ponder IDE
- Verify desktop file associations work
- Test file manager "Open with" options
- Check system notifications show Ponder branding

#### 10. Linux Package Test (if applicable)
```bash
# Test package installation
sudo dpkg -i ponder-ide.deb  # Debian/Ubuntu
# or
sudo rpm -i ponder-ide.rpm   # Red Hat/CentOS
```

## Functionality Testing

### 11. Core Editor Features Test
- Open various file types
- Test syntax highlighting
- Verify IntelliSense works
- Test debugging functionality
- Check integrated terminal

### 12. Extension System Test
- Install extensions from marketplace
- Verify Ponder-authentication extension works
- Test extension development workflow
- Check extension API compatibility

### 13. Settings and Configuration Test
- Open settings UI
- Verify settings file location (.ponder folder)
- Test settings sync (if implemented)
- Check keybinding customization

### 14. Workspace Features Test
- Create and open workspaces
- Test multi-root workspaces
- Verify workspace settings
- Check project-specific configurations

## Network and Authentication Testing

### 15. Ponder Service Integration Test
- Test Ponder authentication extension
- Verify login/logout functionality
- Check service connectivity
- Test authenticated features

### 16. Update System Test
- Check for updates functionality
- Verify update URLs point to Ponder
- Test update installation process

## Error Handling Testing

### 17. Error Message Verification
- Trigger various error conditions
- Verify error messages reference Ponder
- Check error reporting URLs
- Test crash reporting (if enabled)

## Performance Testing

### 18. Startup Performance Test
- Measure application startup time
- Compare with baseline VSCode performance
- Check memory usage
- Verify no performance regressions

### 19. Large File Handling Test
- Open large files
- Test performance with many open tabs
- Verify memory management
- Check responsiveness

## Regression Testing

### 20. VSCode Compatibility Test
- Import VSCode settings
- Test with existing VSCode extensions
- Verify workspace compatibility
- Check migration scenarios

## Documentation Testing

### 21. Help System Test
- Check built-in help references
- Verify documentation links work
- Test context-sensitive help
- Check keyboard shortcut help

## Final Verification Checklist

- [ ] No "Visual Studio Code" text visible in UI
- [ ] No "Microsoft" references in About dialog
- [ ] All icons show Ponder branding
- [ ] URL protocol uses "ponder://"
- [ ] Settings stored in .ponder folder
- [ ] Application name is "Ponder IDE" everywhere
- [ ] File associations work correctly
- [ ] Extensions load and function properly
- [ ] Authentication system works
- [ ] No build errors or warnings
- [ ] Performance is acceptable
- [ ] All platform integrations work

## Troubleshooting Common Issues

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies installed
- Clear node_modules and reinstall
- Check for missing icon files

### Startup Issues
- Verify product.json syntax
- Check file permissions
- Validate icon file formats
- Review application logs

### Integration Problems
- Check desktop file syntax (Linux)
- Verify bundle structure (macOS)
- Review registry entries (Windows)
- Test with clean user profile

## Reporting Issues

When reporting issues, include:
- Platform and version
- Steps to reproduce
- Expected vs actual behavior
- Relevant log files
- Screenshots if applicable
